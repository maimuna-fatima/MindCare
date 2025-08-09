
import { Users, Clock, Heart } from 'lucide-react';
import EmergencyAlert from './EmergencyAlert';
import './Support.css';

const Support = () => {

  const supportOptions = [
    {
      title: "Professional Therapy",
      description: "Connect with licensed mental health professionals",
      icon: Users,
      steps: [
        "Contact your insurance provider for covered therapists",
        "Use Psychology Today to find therapists in your area",
        "Consider online therapy platforms like BetterHelp",
        "Ask your doctor for referrals"
      ]
    },
    {
      title: "Support Groups",
      description: "Join communities of people with similar experiences",
      icon: Heart,
      steps: [
        "Check NAMI for local support groups",
        "Look for online support communities",
        "Ask local hospitals about group programs",
        "Consider peer support programs"
      ]
    },
    {
      title: "Crisis Planning",
      description: "Create a plan for managing mental health crises",
      icon: Clock,
      steps: [
        "Identify your warning signs and triggers",
        "List coping strategies that work for you",
        "Create a contact list of supportive people",
        "Know when and how to access emergency help"
      ]
    }
  ];

  return (
    <div className="support">
      <div className="container section-padding">
        <div className="support-header">
          <h2 className="support-title">Get Immediate Support</h2>
          <p className="support-subtitle">
            If you're in crisis or need immediate help, these resources are available 24/7.
          </p>
        </div>

        <EmergencyAlert />

        <div className="support-options">
          <h3 className="section-title">Long-term Support Options</h3>
          <div className="options-grid">
            {supportOptions.map((option, index) => (
              <div key={index} className="option-card">
                <div className="option-header">
                  <option.icon size={32} color="#3b82f6" />
                  <div>
                    <h4 className="option-title">{option.title}</h4>
                    <p className="option-description">{option.description}</p>
                  </div>
                </div>
                <div className="option-steps">
                  <h5>How to get started:</h5>
                  <ul>
                    {option.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="warning-signs">
          <h3 className="section-title">When to Seek Immediate Help</h3>
          <div className="warning-grid">
            <div className="warning-card urgent">
              <h4>Seek Emergency Help (Call 911) If:</h4>
              <ul>
                <li>You have a specific plan to harm yourself or others</li>
                <li>You've taken steps to carry out a suicide plan</li>
                <li>You're experiencing severe psychosis or delusions</li>
                <li>You're in immediate physical danger</li>
              </ul>
            </div>

            <div className="warning-card moderate">
              <h4>Call Crisis Hotline (988) If:</h4>
              <ul>
                <li>You're having thoughts of suicide or self-harm</li>
                <li>You feel overwhelmed and unable to cope</li>
                <li>You're experiencing severe depression or anxiety</li>
                <li>You need someone to talk to right now</li>
              </ul>
            </div>

            <div className="warning-card general">
              <h4>Consider Professional Help If:</h4>
              <ul>
                <li>Your symptoms interfere with daily activities</li>
                <li>You're using substances to cope</li>
                <li>Your relationships are being affected</li>
                <li>You've been feeling this way for weeks or months</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="self-care-reminder">
          <h3>Remember: You're Not Alone</h3>
          <p>
            Seeking help is a sign of strength, not weakness. Mental health challenges are treatable,
            and with the right support, you can feel better. Take it one day at a time, and don't
            hesitate to reach out when you need help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;