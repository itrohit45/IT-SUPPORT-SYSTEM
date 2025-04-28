import React from 'react';
import { FiAlertCircle, FiClock, FiUsers, FiBarChart2, FiLock, FiMessageSquare } from 'react-icons/fi';

import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <FiAlertCircle size={32} className="text-primary" />,
      title: "Create Tickets",
      description: "Easily report IT issues with priority and department tagging. Attach screenshots or files for better understanding."
    },
    {
      icon: <FiClock size={32} className="text-primary" />,
      title: "Real-time Updates",
      description: "Stay informed on the status of your tickets with live updates and notifications via email or in-app alerts."
    },
    {
      icon: <FiUsers size={32} className="text-primary" />,
      title: "Agent Dashboard",
      description: "IT staff can manage, assign, and resolve tickets from a central panel with workload balancing."
    },
    {
      icon: <FiBarChart2 size={32} className="text-primary" />,
      title: "Analytics Dashboard",
      description: "Track resolution times, common issues, and team performance with comprehensive reporting tools."
    },
    {
      icon: <FiLock size={32} className="text-primary" />,
      title: "Secure Access",
      description: "Role-based access control ensures sensitive data is only accessible to authorized personnel."
    },
    {
      icon: <FiMessageSquare size={32} className="text-primary" />,
      title: "Built-in Chat",
      description: "Direct communication between users and support agents for quick clarification and updates."
    }
  ];

  return (
    <div className="container py-5 mt-5">
      <h2 className="text-center mb-5">Platform Features</h2>
      <div className="row g-4">
        {features.map((feature, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm h-100 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">{feature.icon}</div>
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text text-muted">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
     
    </div>
  );
};

export default Features;