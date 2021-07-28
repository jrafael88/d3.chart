import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./globalStyles";
import Container from "./components/Container";
import Header from "./components/Header";
import { StyledWrapper } from "./components/Wrapper/styled";
import { Routes } from "./routes";
import { theme } from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Container>
          <Header />
          <StyledWrapper>
            <Routes />
          </StyledWrapper>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
