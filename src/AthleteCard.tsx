interface AthleteCardProps {
  name: string;
  position: string;
  avatarUrl?: string;
}

export default function AthleteCard({ name, position, avatarUrl }: AthleteCardProps) {
  // Default avatar from Figma design system
  const defaultAvatar = "https://www.figma.com/api/mcp/asset/86e4a285-5a1f-4827-8317-6e753d72a35d";
  
  return (
    <div className="athlete-card">
      <img 
        src={avatarUrl || defaultAvatar} 
        alt={`${name} avatar`}
        className="athlete-avatar"
      />
      <div className="athlete-details">
        <h3 className="athlete-name">{name}</h3>
        <p className="athlete-position">{position}</p>
      </div>
    </div>
  );
}
