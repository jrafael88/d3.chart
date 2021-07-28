import React from "react";
import { StyledHeader, StyledHeaderLogo } from "./styled";

const Header = () => {
  return (
    <StyledHeader data-testid="header">
      <StyledHeaderLogo>Gráfico com D3</StyledHeaderLogo>
    </StyledHeader>
  );
};

export default Header;