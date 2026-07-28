"use client";

import "@/styles/dashboard/dashboard-navbar.scss";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth-client";
import {
  Diamond,
  Menu,
  ClipboardList,
  Calendar,
  Play,
  Clock,
  BarChart2,
  Users,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

const MAIN_LINKS: NavItem[] = [
  { href: "/today", label: "Today", icon: <Diamond size={18} /> },
  { href: "/exercises", label: "Exercises", icon: <Menu size={18} /> },
  { href: "/workouts", label: "Workouts", icon: <ClipboardList size={18} /> },
  { href: "/planner", label: "Planner", icon: <Calendar size={18} /> },
  { href: "/train", label: "Train", icon: <Play size={18} /> },
];

const SOON_LINKS: NavItem[] = [
  { href: "/nutrition", label: "Nutrition", icon: <Clock size={18} />, disabled: true },
  { href: "/analytics", label: "Analytics", icon: <BarChart2 size={18} />, disabled: true },
  { href: "/community", label: "Community", icon: <Users size={18} />, disabled: true },
];

export default function DashboardNavbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearTokens();
    router.replace("/login");
  }

  function renderLink(item: NavItem) {
    const isActive = pathname === item.href;

    if (item.disabled) {
      return (
        <div
          key={item.href}
          className={`dashboard-navbar__link dashboard-navbar__link--disabled`}
        >
          <span className="dashboard-navbar__icon">{item.icon}</span>
          {isExpanded && <span className="dashboard-navbar__label">{item.label}</span>}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`dashboard-navbar__link ${
          isActive ? "dashboard-navbar__link--active" : ""
        }`}
      >
        <span className="dashboard-navbar__icon">{item.icon}</span>
        <span className="dashboard-navbar__label">{item.label}</span>
      </Link>
    );
  }

  return (
    <nav
      className={`dashboard-navbar ${
        isExpanded ? "dashboard-navbar--expanded" : "dashboard-navbar--collapsed"
      }`}
    >
      <div className="dashboard-navbar__brand">
        <button
          type="button"
          className="dashboard-navbar__logo"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
        >
          <Diamond size={18} />
        </button>
        <span className="dashboard-navbar__brand-name" aria-hidden={!isExpanded}>
          Fitvault
        </span>
        <button
          type="button"
          className="dashboard-navbar__collapse-button"
          onClick={() => setIsExpanded(false)}
          aria-label="Collapse navigation"
          tabIndex={isExpanded ? 0 : -1}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="dashboard-navbar__section">
        {MAIN_LINKS.map(renderLink)}
      </div>

      <div className="dashboard-navbar__soon" aria-hidden={!isExpanded}>
        <p className="dashboard-navbar__section-label">Soon</p>
        <div className="dashboard-navbar__section">
          {SOON_LINKS.map(renderLink)}
        </div>
      </div>

      <div className="dashboard-navbar__footer">
        <div className="dashboard-navbar__avatar" />
        <div className="dashboard-navbar__user-info" aria-hidden={!isExpanded}>
          <p className="dashboard-navbar__user-name">Mara K.</p>
          <p className="dashboard-navbar__user-plan">Free plan</p>
        </div>
        <button
          onClick={handleLogout}
          className="dashboard-navbar__menu-button"
          aria-label="Account menu"
          tabIndex={isExpanded ? 0 : -1}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </nav>
  );
}