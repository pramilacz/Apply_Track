import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutList,
  BarChart3,
  Search,
  ShieldCheck,
  StickyNote,
  Rocket,
} from "lucide-react";
import Button from "../components/Button/Button";
import Badge from "../components/Badge/Badge";
import JobCard from "../components/JobCard/JobCard";
import Logo from "../components/Logo/Logo";
import { useAuth } from "../context/AuthContext";
import { opportunities } from "../data/opportunities";
import "./Landing.css";

const FEATURES = [
  {
    icon: LayoutList,
    title: "Application tracking",
    desc: "Keep every company, role, date, status, and note organized in a single clean dashboard.",
  },
  {
    icon: BarChart3,
    title: "Progress overview",
    desc: "See your applied, interview, offer, and rejection counts instantly, at a glance.",
  },
  {
    icon: Search,
    title: "Opportunity discovery",
    desc: "Browse curated internship openings at companies actively hiring right now.",
  },
  {
    icon: StickyNote,
    title: "Notes on every entry",
    desc: "Attach interview details, contacts, or follow-ups to any application.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    desc: "Sign in with Google or a username. Your applications stay private to your account.",
  },
  {
    icon: Rocket,
    title: "Set up in seconds",
    desc: "No tutorials, no setup wizard. Create an account and log your first application right away.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Add",
    desc: "Add the company, role, date, status, and notes for each application.",
  },
  {
    n: "02",
    title: "Track",
    desc: "Monitor every application from one dashboard as things move forward.",
  },
  {
    n: "03",
    title: "Move forward",
    desc: "Use your overview to stay organized, focused, and ready for what's next.",
  },
];

export default function Landing() {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = "ApplyTrack — Internship Application Tracker";
  }, []);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-eyebrow">Internship application tracker</p>
          <h1 className="hero-heading">
            Track every application.
            <br />
            Stay ready for what's next.
          </h1>
          <p className="hero-desc">
            ApplyTrack helps students organize internship and job applications, monitor
            progress, and keep every opportunity in one place.
          </p>
          <div className="hero-actions">
            <Link to="/register">
              <Button size="lg" icon={ArrowRight}>
                Get started free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Dashboard preview */}
          <div className="hero-preview">
            <div className="hero-preview-bar">
              <span className="hero-preview-dot" style={{ background: "#dc2626" }} />
              <span className="hero-preview-dot" style={{ background: "#d97706" }} />
              <span className="hero-preview-dot" style={{ background: "#16a34a" }} />
              <span className="hero-preview-url">applytrack.app/dashboard</span>
            </div>
            <div className="hero-preview-body">
              <div className="hero-preview-stats">
                <div className="hero-preview-stat">
                  <span className="hpv-num">12</span>
                  <span className="hpv-label">Applied</span>
                </div>
                <div className="hero-preview-stat">
                  <span className="hpv-num">4</span>
                  <span className="hpv-label">Interviews</span>
                </div>
                <div className="hero-preview-stat">
                  <span className="hpv-num">2</span>
                  <span className="hpv-label">Offers</span>
                </div>
                <div className="hero-preview-stat">
                  <span className="hpv-num">3</span>
                  <span className="hpv-label">Rejected</span>
                </div>
              </div>
              <div className="hero-preview-table">
                <div className="hpt-row hpt-head">
                  <span>Company</span>
                  <span>Role</span>
                  <span>Status</span>
                </div>
                <div className="hpt-row">
                  <span className="hpt-company">WSO2</span>
                  <span>SE Intern</span>
                  <Badge status="Interview" />
                </div>
                <div className="hpt-row">
                  <span className="hpt-company">99x</span>
                  <span>Full Stack Intern</span>
                  <Badge status="Offer" />
                </div>
                <div className="hpt-row">
                  <span className="hpt-company">Sysco LABS</span>
                  <span>AI/ML Intern</span>
                  <Badge status="Applied" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="container">
          <p className="section-eyebrow">Why ApplyTrack</p>
          <h2 className="section-heading">Everything you need to stay organized.</h2>
          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="container">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-heading">Three simple steps.</h2>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step" key={step.n}>
                <span className="step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="opportunities-preview">
        <div className="container">
          <p className="section-eyebrow">Open positions</p>
          <h2 className="section-heading">Companies hiring interns right now.</h2>
          <div className="opportunities-grid">
            {opportunities.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <h2>Your best internship search starts now.</h2>
          <p>Join students who stopped losing track of applications and started landing interviews.</p>
          <Link to="/register">
            <Button size="lg" icon={ArrowRight}>
              Create free account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container footer-inner">
          <Logo size="sm" />
          <div className="footer-links">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Register</Link>
            <a href="#features">Features</a>
          </div>
        </div>
      </footer>
    </>
  );
}
