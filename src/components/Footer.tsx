import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyles}>
      <p style={textStyles}>© {new Date().getFullYear()} Minha Empresa. Todos os direitos reservados.</p>
      <div style={socialLinksStyles}>
        <a href="https://facebook.com" style={linkStyles} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href="https://twitter.com" style={linkStyles} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href="https://instagram.com" style={linkStyles} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>
    </footer>
  );
};

// Estilos inline para facilitar o exemplo; podem ser movidos para um arquivo de estilos separado
const footerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#f8f8f8',
  borderTop: '1px solid #ddd',
  marginTop: 'auto',
};

const textStyles: React.CSSProperties = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '10px',
};

const socialLinksStyles: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
};

const linkStyles: React.CSSProperties = {
  textDecoration: 'none',
  color: '#007BFF',
  fontSize: '16px',
};

export default Footer;
