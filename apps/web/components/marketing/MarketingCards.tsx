type TextCard = {
    id: string;
    icon: string;
    title: string;
    subtext: string;
}

const cards: TextCard[] = [
    {
        id: "exercise-lib",
        icon: ".",
        title: "Your exercise library",
        subtext: "Every move you do, with cues and demo clips."
    },
    {
        id: "workouts-lib",
        icon: ".",
        title: "Workouts you compose",
        subtext: "Sets, reps, rest & weight — set once, reuse forever."
    },
    {
        id: "week-planner",
        icon: ".",
        title: "A week that plans itself",
        subtext: "Drag workouts onto days, see the whole week at a glance."
    },
    {
        id: "friends",
        icon: ".",
        title: "Train with friends",
        subtext: "ee who's active, join their session, cheer each other."
    },
        {
        id: "exercise-lib1",
        icon: ".",
        title: "Your exercise library",
        subtext: "Every move you do, with cues and demo clips."
    },
    {
        id: "workouts-lib1",
        icon: ".",
        title: "Workouts you compose",
        subtext: "Sets, reps, rest & weight — set once, reuse forever."
    },
    {
        id: "week-planner1",
        icon: ".",
        title: "A week that plans itself",
        subtext: "Drag workouts onto days, see the whole week at a glance."
    },
    {
        id: "friends1",
        icon: ".",
        title: "Train with friends",
        subtext: "ee who's active, join their session, cheer each other."
    }
]

const Card: React.FC<{ card: TextCard }> = ({ card }) => {
    return (
        <div className="marketing-card">
            <div className="marketing-card__icon">{card.icon}</div>
            <div className="marketing-card__title">{card.title}</div>
            <div className="marketing-card__subtext">{card.subtext}</div>
        </div>
    );
}

const MarketingCards: React.FC = () => {
    return (
        <div className="marketing-cards">
            {cards.map((x) => (
                <Card key={x.id} card={x} />
            ))}
        </div>
    )
}

export default MarketingCards;