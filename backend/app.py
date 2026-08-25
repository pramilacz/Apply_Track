import os

from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, session
from flask_cors import CORS
from flask_dance.contrib.google import google, make_google_blueprint
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db, login_manager
from .models import Application, User

load_dotenv()


def _database_uri():
    """Prefer a managed Postgres DATABASE_URL in production; fall back to
    local SQLite for development. Vercel's serverless filesystem is not a
    persistent disk, so SQLite must never be used in production there."""
    url = os.getenv("DATABASE_URL")
    if url:
        # SQLAlchemy 1.4+/2.x wants the `postgresql://` scheme, but some
        # providers (Neon, Render, Heroku-style) hand out `postgres://`.
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url
    return "sqlite:///applytrack.db"


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-only-fallback-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = _database_uri()
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}

    is_production = os.getenv("VERCEL_ENV") == "production" or os.getenv("FLASK_ENV") == "production"

    # Cross-site cookies are only needed when the frontend and API are on
    # different origins. When deployed together on one Vercel project
    # (frontend + /api rewrite) everything is same-origin and Lax is enough.
    app.config["SESSION_COOKIE_SAMESITE"] = "None" if os.getenv("CROSS_ORIGIN_COOKIES") else "Lax"
    app.config["SESSION_COOKIE_SECURE"] = is_production

    if not is_production:
        os.environ.setdefault("OAUTHLIB_INSECURE_TRANSPORT", "1")

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    allowed_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    CORS(app, supports_credentials=True, origins=allowed_origins)

    google_bp = make_google_blueprint(
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        redirect_to="google_login_callback",
        scope=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
    )
    app.register_blueprint(google_bp, url_prefix="/api/auth/google")

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Authentication required."}), 401

    # ── HEALTH ──────────────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # ── AUTH ────────────────────────────────────────────────────────────
    @app.route("/api/auth/register", methods=["POST"])
    def register():
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters."}), 400

        existing = User.query.filter_by(username=username).first()
        if existing:
            return jsonify({"error": "That username is already taken."}), 409

        user = User(username=username, password=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify({"user": user.to_dict()}), 201

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid username or password."}), 401

        login_user(user)
        return jsonify({"user": user.to_dict()})

    @app.route("/api/auth/logout", methods=["POST"])
    @login_required
    def logout():
        logout_user()
        session.clear()
        return jsonify({"message": "Logged out."})

    @app.route("/api/auth/me")
    def me():
        if not current_user.is_authenticated:
            return jsonify({"user": None}), 200
        return jsonify({"user": current_user.to_dict()})

    @app.route("/api/auth/google/callback/done")
    def google_login_callback():
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        if not google.authorized:
            return redirect(f"{frontend_url}/login?error=google_failed")

        resp = google.get("/oauth2/v2/userinfo")
        if not resp.ok:
            return redirect(f"{frontend_url}/login?error=google_failed")

        info = resp.json()
        google_email = info["email"]

        user = User.query.filter_by(username=google_email).first()
        if not user:
            user = User(
                username=google_email,
                password=generate_password_hash(os.urandom(16).hex()),
            )
            db.session.add(user)
            db.session.commit()

        login_user(user)
        return redirect(f"{frontend_url}/dashboard?welcome=1")

    # ── APPLICATIONS (CRUD) ─────────────────────────────────────────────
    REQUIRED_FIELDS = ("company", "role", "date")
    VALID_STATUSES = {"Applied", "Interview", "Offer", "Rejected"}

    def _validate_payload(data):
        errors = {}
        for field in REQUIRED_FIELDS:
            if not (data.get(field) or "").strip():
                errors[field] = "This field is required."
        status = data.get("status", "Applied")
        if status not in VALID_STATUSES:
            errors["status"] = "Invalid status."
        return errors

    @app.route("/api/applications", methods=["GET"])
    @login_required
    def list_applications():
        apps = (
            Application.query.filter_by(user_id=current_user.id)
            .order_by(Application.id.desc())
            .all()
        )
        return jsonify({"applications": [a.to_dict() for a in apps]})

    @app.route("/api/applications", methods=["POST"])
    @login_required
    def create_application():
        data = request.get_json(silent=True) or {}
        errors = _validate_payload(data)
        if errors:
            return jsonify({"errors": errors}), 400

        new_app = Application(
            company=data["company"].strip(),
            role=data["role"].strip(),
            date=data["date"],
            status=data.get("status", "Applied"),
            notes=(data.get("notes") or "").strip(),
            user_id=current_user.id,
        )
        db.session.add(new_app)
        db.session.commit()
        return jsonify({"application": new_app.to_dict()}), 201

    @app.route("/api/applications/<int:app_id>", methods=["GET"])
    @login_required
    def get_application(app_id):
        entry = Application.query.get_or_404(app_id)
        if entry.user_id != current_user.id:
            return jsonify({"error": "Not found."}), 404
        return jsonify({"application": entry.to_dict()})

    @app.route("/api/applications/<int:app_id>", methods=["PUT"])
    @login_required
    def update_application(app_id):
        entry = Application.query.get_or_404(app_id)
        if entry.user_id != current_user.id:
            return jsonify({"error": "Not found."}), 404

        data = request.get_json(silent=True) or {}
        errors = _validate_payload(data)
        if errors:
            return jsonify({"errors": errors}), 400

        entry.company = data["company"].strip()
        entry.role = data["role"].strip()
        entry.date = data["date"]
        entry.status = data.get("status", entry.status)
        entry.notes = (data.get("notes") or "").strip()
        db.session.commit()
        return jsonify({"application": entry.to_dict()})

    @app.route("/api/applications/<int:app_id>", methods=["DELETE"])
    @login_required
    def delete_application(app_id):
        entry = Application.query.get_or_404(app_id)
        if entry.user_id != current_user.id:
            return jsonify({"error": "Not found."}), 404
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": "Deleted."})

    # ── ERROR HANDLERS (never leak stack traces) ────────────────────────
    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Not found."}), 404

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"error": "Something went wrong. Please try again."}), 500

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
