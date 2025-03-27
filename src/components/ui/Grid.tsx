import React, { ReactNode } from "react";
import styles from "./Grid.module.css";

interface GridProps {
  children: ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  spacing = "md",
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  className = "",
}) => {
  // Create CSS class names for columns at different breakpoints
  const columnClasses = Object.entries(columns)
    .map(([breakpoint, count]) => styles[`cols-${breakpoint}-${count}`])
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`
      ${styles.grid} 
      ${styles[`spacing-${spacing}`]}
      ${columnClasses}
      ${className}
    `}
    >
      {children}
    </div>
  );
};

export default Grid;
