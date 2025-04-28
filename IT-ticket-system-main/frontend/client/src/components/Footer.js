import React from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import '../assets/styles/NavbarFooter.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-icon">🔧</span>
            <span className="logo-text">SupportPro</span>
            <p className="tagline">Your trusted IT support solution</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="/features">Features</a>
              <a href="/how-it-works">How it works</a>
              <a href="/pricing">Pricing</a>
            </div>
            
            <div className="link-group">
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="/blog">Blog</a>
              <a href="/careers">Careers</a>
            </div>
            
            <div className="link-group">
              <h4>Support</h4>
              <a href="/contact">Contact</a>
              <a href="/faq">FAQ</a>
              <a href="/docs">Documentation</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} SupportPro. All rights reserved.
          </div>
          
          <div className="social-links">
            <a href="https://github.com" aria-label="GitHub"><FiGithub /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FiTwitter /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="mailto:support@supportpro.com" aria-label="Email"><FiMail /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;