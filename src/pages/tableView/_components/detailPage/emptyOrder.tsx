import styled, { css } from 'styled-components';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';

const emptyOrder = () =>{
    return(
        <>
            <Container>
                <ImageWrapper>
                    <img src={IMAGE_CONSTANTS.DetailPageIcon} alt="아코얼굴" />
                </ImageWrapper>
                <TextWrapper>
                    아직 주문 내역이 없어요.
                </TextWrapper>
            </Container>
            
        </>  
    );
};

export default emptyOrder;

const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6rem 0;
    gap: 2rem;
`;

const ImageWrapper = styled.div`
    width: 14.8rem;
    height: 9.5rem;
    img{
        width: 14.8rem;
        height: 9.5rem;
    }
`;

const TextWrapper = styled.div`
    color: ${({theme}) => theme.colors.Black01};
    ${({ theme }) => css(theme.fonts.Bold20)};
`;

