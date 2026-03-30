import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: calc(var(--vh, 1vh) * 100);
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Container2 = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  box-sizing: border-box;
  gap: 2.25rem;

  @media (max-width: 800px) {
    padding: 1.5rem;
    gap: 1rem;
  }
  @media (max-width: 500px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

export const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.img`
  width: 160px;
`;

export const Image2 = styled.img`
  height: 162.752px;
  aspect-ratio: 250/162.75;

  @media (max-width: 800px) {
    height: 140px;
  }
  @media (max-width: 500px) {
    height: 100px;
  }
`;

export const TitleBox = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 8px;
`;

export const Title = styled.div`
  ${({ theme }) => theme.fonts.ExtraBold26};
  color: ${({ theme }) => theme.colors.Black01};
`;

export const SemiTitle = styled.div`
  ${({ theme }) => theme.fonts.Bold16};
  color: ${({ theme }) => theme.colors.Black02};
`;

export const Cover = styled.div`
  width: 100%;
`;

export const ErrorMessage = styled.p`
  ${({ theme }) => theme.fonts.Medium14};
  color: ${({ theme }) => theme.colors.Error};
  margin: 0;
  width: 100%;
  box-sizing: border-box;
`;

export const BackIMG = styled.img`
  position: absolute;
  left: 40px;
  top: 40px;
  width: 13px;
  cursor: pointer;

  @media (max-width: 800px) {
    left: 32px;
    top: 32px;
  }
  @media (max-width: 500px) {
    left: 24px;
    top: 24px;
  }
`;
