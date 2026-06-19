import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '2rem 1rem',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      textAlign: 'center',
      borderTop: '1px solid #333'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Your Personal Info */}
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
          Prathip M.
        </h3>
        <p style={{ color: '#aaa', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
          Full Stack Developer & Portfolio Systems
        </p>

        {/* Support Email Link */}
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#aaa' }}>
          Questions or Support?{' '}
          <a 
            href="mailto::contact.prathip@gmail.com" 
            style={{ 
              color: '#646cff', 
              textDecoration: 'none', 
              fontWeight: '500' 
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            contact.prathip@gmail.com
          </a>
        </p>

        {/* Copyright */}
        <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1.5rem', marginBottom: '0' }}>
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;