interface MentorSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

const mentors = [
  {
    id: "MarcusAI",
    name: "MarcusAI",
    description: "Stoic wisdom & leadership insights",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "MayaAI", 
    name: "MayaAI",
    description: "Emotional intelligence & empathy",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "SteveAI",
    name: "SteveAI", 
    description: "Innovation & perfectionism",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "KobeAI",
    name: "KobeAI",
    description: "Mamba mentality & excellence", 
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "MandelaAI",
    name: "MandelaAI",
    description: "Reconciliation & moral courage",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "KobunAI",
    name: "KobunAI", 
    description: "Zen wisdom & mindfulness",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  }
];

export default function MentorSelection({ value, onChange }: MentorSelectionProps) {
  return (
    <div>
      <p className="text-neutral-500 mb-6">Each mentor brings unique wisdom to analyze your feedback</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className={`bg-white rounded-xl p-6 text-center cursor-pointer border-2 transition-all hover:shadow-lg ${
              value === mentor.id 
                ? "border-primary bg-primary/5" 
                : "border-transparent hover:border-primary/20"
            }`}
            onClick={() => onChange(mentor.id)}
          >
            <img 
              src={mentor.image} 
              alt={`${mentor.name} AI`} 
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="font-semibold text-neutral-900 mb-2">{mentor.name}</h3>
            <p className="text-sm text-neutral-500">{mentor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
