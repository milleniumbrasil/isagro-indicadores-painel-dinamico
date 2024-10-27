import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside style={sidebarStyles}>
      <nav style={navStyles}>
        <h2 style={headerStyles}>Menu</h2>
        <ul style={listStyles}>
          <li style={itemStyles}>
            <Link to="/" style={linkStyles}>Home</Link>
          </li>
          <li style={itemStyles}>
            <Link to="/about" style={linkStyles}>About</Link>
          </li>
          <li style={itemStyles}>
            <Link to="/services" style={linkStyles}>Services</Link>
          </li>
          <li style={itemStyles}>
            <Link to="/contact" style={linkStyles}>Contact</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

// Estilos inline para facilitar o exemplo; podem ser movidos para um arquivo de estilos separado
const sidebarStyles: React.CSSProperties = {
  width: '250px',
  padding: '20px',
  backgroundColor: '#f0f0f0',
  height: '100vh',
  position: 'fixed',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const headerStyles: React.CSSProperties = {
  fontSize: '1.5em',
  marginBottom: '1em',
};

const listStyles: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
};

const itemStyles: React.CSSProperties = {
  marginBottom: '10px',
};

const linkStyles: React.CSSProperties = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '1.1em',
};

export default Sidebar;
