import styled from 'styled-components';

export const OrderListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  height: 100%;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.Gray01};
  box-sizing: border-box;
  padding: 1.25rem;
  border-radius: 1rem;
  gap: 1rem;
`;

export const OrderBoxDivider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px dashed ${({ theme }) => theme.colors.Gray02};
  margin: 0.25rem 0;
`;

export const EmptyStateWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  min-height: 200px;
`;

export const EmptyStateImage = styled.img`
  display: block;
  width: auto;
  height: 120px;
  object-fit: contain;
`;

export const EmptyStateText = styled.p`
  margin: 0;
  text-align: center;
  ${({ theme }) => theme.fonts.Bold18};
  color: ${({ theme }) => theme.colors.Black02};
  line-height: 1.5;
  white-space: pre-line;
`;
