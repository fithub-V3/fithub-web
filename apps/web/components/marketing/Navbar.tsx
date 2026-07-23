"use client";

import { useState } from "react";

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
                <div className="navbar__links__link">Features</div>
                <div className="navbar__links__link">Train together</div>
                <div className="navbar__links__link">Pricing</div>
                <div className="navbar__links__link">Log in</div>
                <div className="navbar__links__link green-button">Get started free</div>
            </div>
        </nav>
    );
}
