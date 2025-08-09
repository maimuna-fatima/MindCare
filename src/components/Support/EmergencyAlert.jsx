
import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';

const EmergencyAlert = () => {
  return (
    <div className="emergency-alert">
      <div className="alert-content">
        <AlertTriangle size={24} color="#dc2626" />
        <div className="alert-text">
          <h4>Emergency Notice</h4>
          <p>
            If you are in immediate danger or having thoughts of suicide,
            please call <strong>911</strong> or go to your nearest emergency room immediately.
            For crisis support, call <strong>988</strong> (Suicide & Crisis Lifeline).
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;