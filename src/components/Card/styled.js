import styled from "styled-components";

export const StyledCard = styled.div`
  width: 100%;
  margin: auto;
  box-shadow: 0 0.46875rem 2.1875rem rgb(4 9 20 / 3%), 0 0.9375rem 1.40625rem rgb(4 9 20 / 3%), 0 0.25rem 0.53125rem rgb(4 9 20 / 5%), 0 0.125rem 0.1875rem rgb(4 9 20 / 3%);
  border-radius: 2px;
  background-color: white;
  padding: 16px;
`;

export const StyledCardTitle = styled.div`
  ${'' /* text-transform: uppercase; */}
  color: rgba(13,27,62,0.7);
  ${'' /* font-weight: bold; */}
  font-size: .88rem;
  margin-bottom: .75rem;
`;
