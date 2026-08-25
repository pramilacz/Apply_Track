import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BriefcaseBusiness, Search, LogOut, Menu, X } from "lucide-react";
import Logo from "../Logo/Logo";
import "./MobileNav.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { to: "/opportunities", label: "Opportunities", icon: Search },
];

export default function MobileNav({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="mobile-topbar">
        <Logo size="sm" />
        <button
          className="mobile-topbar-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </header>

      {open && (
        <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Logo size="sm" />
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
              <ThemeToggle />
            </div>

            <nav className="mobile-drawer-nav" aria-label="Dashboard">
              {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `mobile-drawer-link ${isActive ? "mobile-drawer-link-active" : ""}`
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <div className="mobile-drawer-user">
                <div className="mobile-drawer-avatar" aria-hidden="true">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span>{user?.username}</span>
              </div>
              <button className="mobile-drawer-link" onClick={onLogout}>
                <LogOut size={18} aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
