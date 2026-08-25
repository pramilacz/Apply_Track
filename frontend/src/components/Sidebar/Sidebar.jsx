import { NavLink } from "react-router-dom";
import { LayoutDashboard, BriefcaseBusiness, Search, LogOut } from "lucide-react";
import Logo from "../Logo/Logo";
import "./Sidebar.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { to: "/opportunities", label: "Opportunities", icon: Search },
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo size="lg" />
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="sidebar-username" title={user?.username}>
            {user?.username}
          </span>
          <ThemeToggle />
        </div>
        <button className="sidebar-link sidebar-logout" onClick={onLogout}>
          <LogOut size={18} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}
