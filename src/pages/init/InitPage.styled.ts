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
  min-height: calc(var(--vh, 1vh) * 100);
  justify-content: center;
  align-items: center;
`;

export const Container2 = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: calc(var(--vh, 1vh) * 100);
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  box-sizing: border-box;
  gap: 5rem;

  @media (max-width: 800px) {
    padding: 1.5rem;
    gap: 4rem;
  }
  @media (max-width: 500px) {
    padding: 1rem;
    gap: 3rem;
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
  height: 218px;
  aspect-ratio: 250/218;

  @media (max-width: 800px) {
    height: 140px;
  }
  @media (max-width: 500px) {
    height: 100px;
  }
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  gap: 12px;
`;

export const Paragraph = styled.div`
  ${({ theme }) => theme.fonts.ExtraBold20};
  color: ${({ theme }) => theme.colors.Black01};

  opacity: 0.6;
`;

export const Contain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Contain2 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Btn_1 = styled.div`
  ${({ theme }) => theme.fonts.Bold16};
  color: ${({ theme }) => theme.colors.Bg};
  background-color: ${({ theme }) => theme.colors.Orange01};
  border: 1px solid ${({ theme }) => theme.colors.Orange01};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 1rem;
  max-width: 380px;

  cursor: pointer;
`;

export const Btn_2 = styled.div`
  ${({ theme }) => theme.fonts.Bold16};
  color: ${({ theme }) => theme.colors.Orange01};
  background-color: ${({ theme }) => theme.colors.Bg};
  border: 1px solid ${({ theme }) => theme.colors.Orange01};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 1rem;
  max-width: 380px;

  cursor: pointer;
`;
