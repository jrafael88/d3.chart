import styled from "styled-components";

export const StyledHeader = styled.div`
  background: ${({ theme }) => theme.colors?.header?.bg};
  box-shadow: 0 0.46875rem 2.1875rem rgb(4 9 20 / 3%), 0 0.9375rem 1.40625rem rgb(4 9 20 / 3%), 0 0.25rem 0.53125rem rgb(4 9 20 / 5%), 0 0.125rem 0.1875rem rgb(4 9 20 / 3%);
  position: fixed;
  z-index: 1;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  flex: 1 1 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  padding: 15px 20px;
  margin-bottom: 25px;
`;

export const StyledHeaderLogo = styled.div`
  font-size: 18px;
  font-weight: 800;
  font-style: italic; 
`;
