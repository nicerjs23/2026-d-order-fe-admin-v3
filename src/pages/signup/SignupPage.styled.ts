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
  gap: 1.25rem;

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
  width: 170px;
`;

export const Image2 = styled.img`
  height: 163px;
  aspect-ratio: 180/163;

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
  padding: 1rem 1rem 1rem 0rem;
  gap: 8px;

  @media (max-width: 800px) {
    padding: 0.875rem 0.875rem 0.875rem 0rem;
  }
  @media (max-width: 500px) {
    padding: 0.75rem 0.75rem 0.75rem 0rem;
  }
`;

export const Title = styled.div`
  ${({ theme }) => theme.fonts.ExtraBold26};
  color: ${({ theme }) => theme.colors.Black01};
`;

export const SemiTitle = styled.div`
  ${({ theme }) => theme.fonts.Bold16};
  color: ${({ theme }) => theme.colors.Black02};
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
