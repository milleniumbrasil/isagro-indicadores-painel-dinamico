import React from 'react';

type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title = 'Título da Aplicação' }) => {
  return (
    <header style={headerStyles}>
      <h1 style={titleStyles}>{title}</h1>
      <nav style={navStyles}>
        <a href="#home" style={linkStyles}>Home</a>
        <a href="#about" style={linkStyles}>Sobre</a>
        <a href="#contact" style={linkStyles}>Contato</a>
      </nav>
    </header>
  );
};

// Estilos inline para facilitar o exemplo; podem ser movidos para um arquivo de estilos separado
const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f8f8f8',
  borderBottom: '1px solid #ddd',
};

const titleStyles: React.CSSProperties = {
  fontSize: '24px',
  color: '#333',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
};

const linkStyles: React.CSSProperties = {
  textDecoration: 'none',
  color: '#007BFF',
  fontSize: '16px',
};

export default Header;
