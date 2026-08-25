import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo/Logo";
import Button from "../components/Button/Button";
import { Input } from "../components/Input/FormField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast/ToastContext";
import { authService } from "../services/authService";
import { GoogleIcon } from "./Login";
import "./AuthPages.css";

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Register — ApplyTrack";
  }, []);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.username.trim(), form.password);
      toast.success("Account created! Welcome to ApplyTrack.");
      navigate("/dashboard");
    } catch (err) {
      setErrors({ username: err.response?.data?.error || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <Link to="/" className="auth-card-logo">
        <Logo />
      </Link>
      <h1 className="auth-card-title">Create your account</h1>
      <p className="auth-card-subtitle">Free forever. Takes about 30 seconds.</p>

      <a href={authService.googleLoginUrl()} className="btn-google">
        <GoogleIcon />
        Continue with Google
      </a>

      <div className="auth-divider">
        <span>or register with username</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={errors.username}
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
        <Input
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          error={errors.confirm}
          required
        />

        <Button type="submit" className="auth-submit" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
