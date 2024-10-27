import { CSSProperties } from 'react';

export const mainContainer: CSSProperties = {
  padding: '20px',
};

export const title: CSSProperties = {
  fontSize: '2em',
  marginBottom: '0.5em',
};

export const paragraph: CSSProperties = {
  fontSize: '1.2em',
  marginBottom: '1.5em',
};

export const cardContainer: CSSProperties = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
};

export const card: CSSProperties = {
  flex: '1 1 30%',
  padding: '20px',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

export const cardTitle: CSSProperties = {
  fontSize: '1.5em',
  marginBottom: '0.5em',
};

export const cardContent: CSSProperties = {
  fontSize: '1em',
};
