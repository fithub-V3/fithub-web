"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar__title-logo">Fitvault</div>

            <button
                type="button"
                className="navbar__toggle"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
            >
                <span className="navbar__toggle-bar" />
                <span className="navbar__toggle-bar" />
                <span className="navbar__toggle-bar" />
            </button>

            <div className={`navbar__links${isOpen ? " navbar__links--open" : ""}`}>
                <Link className="navbar__links__link" href="#">Features</Link>
                <Link className="navbar__links__link" href="#">Train together</Link>
                <Link className="navbar__links__link" href="#">Pricing</Link>
                <Link className="navbar__links__link" href="/login">Log in</Link>
                <Link className="navbar__links__link green-button" href="/register">Get started free</Link>
            </div>
        </nav>
    );
}
