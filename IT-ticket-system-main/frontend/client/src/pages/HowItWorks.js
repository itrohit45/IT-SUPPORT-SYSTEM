import React from 'react';
import { FiEdit, FiUserCheck, FiCheckCircle, FiMail, FiSettings, FiThumbsUp } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiEdit size={32} className="text-primary" />,
      title: "1. Submit a Ticket",
      description: "Describe the issue you're facing, select its urgency level, and attach any relevant files or screenshots.",
      details: [
        "Multiple category options",
        "Priority levels (Low, Medium, High, Critical)",
        "File attachments supported"
      ]
    },
    {
      icon: <FiUserCheck size={32} className="text-primary" />,
      title: "2. Ticket is Assigned",
      description: "Our intelligent routing system automatically assigns your ticket to the most appropriate support agent.",
      details: [
        "Automatic agent assignment",
        "SLA tracking begins",
        "Initial response notification"
      ]
    },
    {
      icon: <FiCheckCircle size={32} className="text-primary" />,
      title: "3. Track and Resolve",
      description: "Communicate with agents and follow progress until resolution. Rate your support experience afterwards.",
      details: [
        "Real-time status updates",
        "Built-in communication channel",
        "Resolution feedback system"
      ]
    },
    {
      icon: <FiMail size={32} className="text-primary" />,
      title: "4. Receive Updates",
      description: "Get email and in-app notifications about your ticket status changes and required actions.",
      details: [
        "Multi-channel notifications",
        "Scheduled follow-ups",
        "Escalation alerts"
      ]
    },
    {
      icon: <FiSettings size={32} className="text-primary" />,
      title: "5. Resolution Process",
      description: "Agents work on your issue with access to knowledge base and can escalate if needed.",
      details: [
        "Internal collaboration tools",
        "Knowledge base integration",
        "Escalation paths"
      ]
    },
    {
      icon: <FiThumbsUp size={32} className="text-primary" />,
      title: "6. Confirm Solution",
      description: "Review the solution, provide feedback, and close the ticket or request further assistance.",
      details: [
        "Solution verification",
        "Customer satisfaction survey",
        "Ticket closure confirmation"
      ]
    }
  ];

  return (
    <div className="container py-5 bg-light mt-5">
      <div className="text-center mb-5">
        <h2>How Our Ticketing System Works</h2>
        <p className="lead text-muted">Simple steps to get your IT issues resolved quickly</p>
      </div>
      
      <div className="row g-4">
        {steps.map((step, index) => (
          <div className="col-md-4" key={index}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-3">{step.icon}</div>
                <h4 className="text-center">{step.title}</h4>
                <p className="text-center text-muted">{step.description}</p>
                <ul className="mt-3 ps-3">
                  {step.details.map((detail, i) => (
                    <li key={i} className="mb-2">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
      </div>
    
  );
};

export default HowItWorks;