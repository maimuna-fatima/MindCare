
import { ExternalLink, MessageCircle, Globe } from 'lucide-react';

const ResourceCard = ({ resource }) => {
  const getIcon = () => {
    const contact = resource.contact.toLowerCase();
    if (contact.includes('741741') || contact.includes('text')) {
      return <MessageCircle size={24} color="#3b82f6" />;
    } else if (contact.includes('.com') || contact.includes('.org')) {
      return <Globe size={24} color="#10b981" />;
    } else {
      return <Globe size={24} color="#6b7280" />;
    }
  };

  const handleContactClick = () => {
    const contact = resource.contact.toLowerCase();
    if (contact.includes('.com') || contact.includes('.org')) {
      window.open(`https://${resource.contact}`, '_blank');
    } else if (contact.includes('text')) {
      alert(`To use this service, ${resource.contact}`);
    } else {
      alert(`Contact information: ${resource.contact}`);
    }
  };

  return (
    <div className="resource-card">
      <div className="resource-header">
        {getIcon()}
        <div className="resource-info">
          <h4 className="resource-name">{resource.name}</h4>
          <button
            onClick={handleContactClick}
            className="resource-contact"
            title={`Contact: ${resource.contact}`}
          >
            {resource.contact}
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      <p className="resource-description">{resource.description}</p>

      <div className="resource-actions">
        <button
          onClick={handleContactClick}
          className="contact-button"
        >
          {resource.contact.includes('.com') || resource.contact.includes('.org')
            ? 'Visit Website'
            : resource.contact.includes('text')
              ? 'Get Text Info'
              : 'View Info'
          }
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;