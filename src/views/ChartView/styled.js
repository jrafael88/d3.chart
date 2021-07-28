import styled from 'styled-components'

export const StyledIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-top: 35px;
  margin-bottom: 10px;
`

export const StyledFilters = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 25px;
  select {
    margin-left: 5px;
  }
`

export const StyledTable = styled.table`
  width: 100%;
  background-color: rgba(0,0,0,0);
  border-collapse: collapse;
  th, td {
    padding: .55rem;
    vertical-align: top;
    border-top: 1px solid #e9ecef;
  }

  thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #e9ecef;
  }

  th {
    text-align: left;
  }
`;