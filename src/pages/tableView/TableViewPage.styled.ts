import styled from 'styled-components';

export const PageWrapper = styled.div`
    width: 100%;
    /* min-height: calc(var(--vh, 1vh) * 100);      */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({theme}) => theme.colors.Bg};
    overflow: hidden; /* 전체 페이지 스크롤 방지 */
`;