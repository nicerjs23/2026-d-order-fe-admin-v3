import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
`;

export const Back = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export const ModalWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 2;
`;

export const ModalTop = styled.div`
  height: 100%;
  width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-sizing: border-box;
  padding: 40px 66px;
  gap: 48px;
  border-radius: 20px 20px 0 0;
`;

export const Title = styled.div`
  ${({ theme }) => theme.fonts.Bold20};
  color: ${({ theme }) => theme.colors.Black01};
`;

export const Image = styled.img`
  width: 144px;
  aspect-ratio: 180/163;
`;

export const ToLogin = styled.div`
  ${({ theme }) => theme.fonts.Bold20};
  color: ${({ theme }) => theme.colors.Orange01};
  background-color: ${({ theme }) => theme.colors.Bg};
  width: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-top: 1px solid ${({ theme }) => theme.colors.Black02};
  padding: 1rem;
  border-radius: 0 0 20px 20px;

  z-index: 3;
  cursor: pointer;
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

export const LottieWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;
