import styled from 'styled-components';

export const AmountBoxWrapper = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-sizing: border-box;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  ${({ theme }) => theme.fonts.Medium16};
  color: ${({ theme }) => theme.colors.Gray03};
`;

export const SectionTitleIcon = styled.span`
  display: flex;
  color: ${({ theme }) => theme.colors.Gray03};
`;

export const SectionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

/** 아래쪽 목록 영역만 채우고 기본 문구를 가운데 배치 */
export const EmptyListArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
`;

export const EmptyListText = styled.p`
  margin: 0;
  text-align: center;
  ${({ theme }) => theme.fonts.Medium16};
  color: ${({ theme }) => theme.colors.Gray03};
`;

export const Row = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
`;

export const MenuName = styled.span<{ $isZero?: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme, $isZero }) =>
    $isZero ? theme.colors.Gray02 : theme.colors.Black01};
`;

export const Quantity = styled.span<{ $isZero?: boolean }>`
  flex-shrink: 0;
  padding: 0 0.5rem;
  background-color: ${({ theme }) => theme.colors.Gray01};
  border-radius: 9999px;
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme, $isZero }) =>
    $isZero ? theme.colors.Gray02 : theme.colors.Black01};
`;
