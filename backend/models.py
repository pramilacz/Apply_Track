from flask_login import UserMixin
from .extensions import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    applications = db.relationship(
        "Application", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {"id": self.id, "username": self.username}


class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(150), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="Applied")
    notes = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "role": self.role,
            "date": self.date,
            "status": self.status,
            "notes": self.notes or "",
        }
