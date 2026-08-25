import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-signin">
            Sign in
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        <button
          className="navbar-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          <a href="#features" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="#how" onClick={() => setOpen(false)}>
            How it works
          </a>
          <ThemeToggle />
          <Link to="/login" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link to="/register" onClick={() => setOpen(false)}>
            <Button className="navbar-mobile-cta">Get started free</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
