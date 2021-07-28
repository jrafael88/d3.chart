import React from "react";
import { StyledWrapper } from "./styled";

const Wrapper = ({ children }) => {
  return (
    <StyledWrapper data-testid="wrapper">
      {children}
    </StyledWrapper>
  );
};

export default Wrapper;