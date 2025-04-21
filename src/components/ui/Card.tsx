import React, { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  onClick?: () => void;
  hoverable?: boolean;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  hoverable = false,
  elevated = false,
}) => {
  const variantClass = styles[variant] || styles.default;

  return (
    <div
      className={`
        ${styles.card}
        ${variantClass}
        ${hoverable ? styles.hoverable : ''}
        ${elevated ? styles.elevated : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
