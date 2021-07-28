import React from "react";
import { StyledContainer } from "./styled";

const Container = ({ children }) => {
  return (
    <StyledContainer data-testid="container">
      {children}
    </StyledContainer>
  );
};

export default Container;