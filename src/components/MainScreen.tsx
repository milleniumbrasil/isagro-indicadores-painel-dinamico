import React from 'react';
import * as styles from './MainScreen.styles';
import { MainScreenProps, CardProps } from './MainScreen.types';

const MainScreen: React.FC<MainScreenProps> = ({ cards }) => {
  return (
    <section style={styles.mainContainer}>
      <h1 style={styles.title}>Bem-vindo à Minha Aplicação</h1>
      <div style={styles.cardContainer}>
        {cards.map((card: CardProps, index: number) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.cardTitle}>{card.title}</h2>
            <p style={styles.cardContent}>{card.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainScreen;
