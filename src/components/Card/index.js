import React from "react";
import { StyledCard, StyledCardTitle } from "./styled";

const Card = ({ title, children }) => {

  return (
    <StyledCard data-testid="card">
      <StyledCardTitle>{title}</StyledCardTitle>
      {children}
    </StyledCard>
  );
};

export default Card;