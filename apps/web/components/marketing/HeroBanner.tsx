export default function HeroBanner() {
    return (
        <div className="hero-banner">
            <div className="hero-banner__left">
                <div className="hero-banner__left__neon-text">NOW WITH FRIENDS & PRESENCE</div>
                <div className="hero-banner__left__title">Build it. Plan it. Actually do it.</div>
                <div className="hero-banner__left__subtitle">Fithub is where you build your own exercise library, compose real workouts, plan your week — and log exactly what happened. No templates that don't fit how you train.</div>
                <div className="hero-banner__left__buttons">
                    <div className="hero-banner__left__buttons__button green-button">Start training free</div>
                    <div className="hero-banner__left__buttons__button">See how it works</div>
                
                </div>
                <div className="hero-banner__left__color-text">Train alongside freinds in real time - new</div>
            </div>
            <div className="hero-banner__right">
                <div className="hero-banner__right__example">
                    <div className="hero-banner__right__example__header">
                        <div className="hero-banner__right__example__header__title">TODAY'S WORKOUT</div>
                        <div className="hero-banner__right__example__header__tag">● live</div>
                    </div>
                    <div className="hero-banner__right__example__workout">
                        <div className="hero-banner__right__example__workout__title">Push Day A</div>
                        <div className="hero-banner__right__example__workout__subtext">6 exercises · ~52 min</div>
                    </div>
                    <div className="hero-banner__right__example__cards">
                        <div className="hero-banner__right__example__cards__card">
                            <div className="hero-banner__right__example__cards__card__title">STREAK</div>
                            <div className="hero-banner__right__example__cards__card__text green-text">12d</div>
                        </div>
                        <div className="hero-banner__right__example__cards__card">
                            <div className="hero-banner__right__example__cards__card__title">FRIENDS ACTIVE</div>
                            <div className="hero-banner__right__example__cards__card__text">2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}