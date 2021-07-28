import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100vw;
    overflow-x: hidden;
  }
  *, *::after, *::before {
    box-sizing: border-box;
    outline: none;
  }

  body {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    background-color: ${({ theme }) => theme.colors?.base?.main};
    color: ${({ theme }) => theme.colors?.base?.color10};
  }
  h1 {
    font-size: 40px;
    font-family: 'Montserrat', sans-serif;
    line-height: 48px;
  }
  h2 {
    font-size: 32px;
    font-family: 'Montserrat', sans-serif;
    line-height: 48px;
  }
  h3 {
    font-size: 24px;
    font-family: 'Montserrat', sans-serif;
    line-height: 28px;
  }
  h4 {
    font-size: 20px;
    font-family: 'Montserrat', sans-serif;
    line-height: 24px;
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors?.base?.color10};
  }
  ul {
    list-style-type: none;
  }

  #APICallChart .dots {
    cursor: pointer;
  }

  #APICallChart .axis.xAxis path {
    stroke: #f0f0f0;
  }

  #APICallChart .axis.yAxis path {
    display: none;
    stroke: #b6b6b6;
  }

  line{
    stroke: #f0f0f0;
  }

  text{
    color: #b6b6b6;
    font-size: 11px;
    letter-spacing: .6px;
  }

  .tooltip-chart {
    position: absolute;
    top: 0;
    min-width: 30px;
    min-height: 17px;
    padding: 6px 8px;
    color: #fff;
    font: 12px sans-serif;
    text-decoration: none;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 2px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12);
    pointer-events: none;
    opacity: 0;
    z-index: 1;
  }


  .row {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
  }
  
  .col {
    width: 50%;
    box-sizing: border-box;
    padding-left: 7.5px;
    padding-right: 7.5px;
    margin-bottom: 15px;
  }

  .col-24 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .col-12 {
    flex: 0 0 50%;
    max-width: 50%;
    padding-left: 7.5px;
    padding-right: 7.5px;
  }
`;

export const StyledDisplay = styled.p`
  font-family: "Montserrat", sans-serif;
  color: ${({ theme }) => theme.colors?.base?.color10};
  font-weight: 600;
  font-size: 64px;
  line-height: 78px;
  letter-spacing: -1.6px;
  margin: 15px 0px;
`;

export const StyledH3 = styled.h3`
  color: ${({ theme }) => theme.colors?.base?.color7};
  font-weight: 600;
`;

export const StyledH1 = styled.h1`
  color: ${({ theme }) => theme.colors?.base?.color9};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const StyledSubtitle = styled.span`
  color: ${({ theme }) => theme.colors?.base?.color8};
  font-size: 16px;
  line-height: 24px;
`;
