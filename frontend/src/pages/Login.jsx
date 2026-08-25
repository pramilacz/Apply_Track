import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo/Logo";
import Button from "../components/Button/Button";
import { Input } from "../components/Input/FormField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast/ToastContext";
import { authService } from "../services/authService";
import "./AuthPages.css";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login — ApplyTrack";
  }, []);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (searchParams.get("error") === "google_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <Link to="/" className="auth-card-logo">
        <Logo />
      </Link>
      <h1 className="auth-card-title">Welcome back</h1>
      <p className="auth-card-subtitle">Sign in to keep tracking your applications.</p>

      <a href={authService.googleLoginUrl()} className="btn-google">
        <GoogleIcon />
        Continue with Google
      </a>

      <div className="auth-divider">
        <span>or sign in with username</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          endAdornment={
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="auth-submit" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export { GoogleIcon };
