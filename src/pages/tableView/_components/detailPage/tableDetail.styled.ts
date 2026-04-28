import styled, { css } from 'styled-components';


export const DetailWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 3rem 0;
    gap: 1rem;
    box-sizing: border-box;
    min-width: 54rem;
    color: ${({ theme }) => theme.colors.Black01};
    background-color: ${({theme}) => theme.colors.Bg}; 
    margin-bottom: 1rem;
    ${({ theme }) => css(theme.fonts.ExtraBold26)};
`;

export const Container = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    align-items: center;
`;
export const DetailHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 1.8rem;
    cursor: pointer;
`;

export const BackButton = styled.div`
    /* width: 40px;
    height: 40px; */
    display: flex;
    justify-content: center;
    align-items: flex-center;
    margin-right: 1rem;
    img{
        width: 13px;
        height: fit-content;
    }
`;

export const TextWrapper = styled.div`
    gap: 0.2rem;
    font-size: 1.25rem;
    font-weight: 800;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .tableNumber{
        color: ${({theme}) => theme.colors.Focused};

    }
`;

export const TableReset = styled.button`
    background-color: ${({theme}) => theme.colors.Black02}; 
    display: flex;
    padding: 0.5rem 0.7rem;
    border-radius: 1rem;
    gap: 0.3rem;
    color: ${({theme}) => theme.colors.Bg};
    ${({ theme }) => css(theme.fonts.Bold12)};
`;

export const DivideLine = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${({theme}) => theme.colors.Bg}; 
    border-bottom: 1px solid rgba(192, 192, 192, 0.5);
`;

export const TotalPrice = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: ${({theme}) => theme.colors.Black01};
    
    .original{
        color: ${({theme}) => theme.colors.Black02};
        ${({ theme }) => css(theme.fonts.Medium16)};

    }
    .total{
        color: ${({theme}) => theme.colors.Orange01};
    }
`;

export const MenuList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: flex-start;
`;

export const ItemWrapper = styled.div`
    width: 100%;
    height: 6.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

export const ContentContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 2.5rem;
`;

export const ImageWrapper = styled.div`
    width: 6.25rem;
    height: 6.25rem;    
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.colors.Gray01};

    img{
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
    }
`;

export const TitleWrapper = styled.div`
    height: 90%;    
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.4rem 0;
    ${({ theme }) => css(theme.fonts.Bold14)};
    .menuName{
        font-size: 1rem;
        font-weight: 700;
        ${({ theme }) => css(theme.fonts.ExtraBold16)};
    }
`;

export const GrayText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: ${({theme}) => theme.colors.Focused};
`;


export const ButtonWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;


export const CancleButton = styled.button`
    min-width: 5.78rem;
    width: fit-content;
    height: 1.7rem;
    border-radius: 0.9rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.28rem;
    background-color: ${({theme}) => theme.colors.Orange00};
    color: ${({theme}) => theme.colors.Orange01};
    ${({ theme }) => css(theme.fonts.SemiBold14)};

    img{
        width: 1rem;
        height: 1rem;
    }
`;

