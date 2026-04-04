import styled from 'styled-components';

export const SideBarWrapper = styled.div`
  position: fixed;
  top: 73px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 92px;
  height: 396px;

  border-radius: 0 16px 16px 0;
  box-shadow: 4px 0px 4px 0px rgba(0, 0, 0, 0.04);
  background-color: ${({ theme }) => theme.colors.Gray01};
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 0;
  box-sizing: border-box;

  border-bottom: 2px solid rgba(192, 192, 192, 0.5);

  & img {
    width: 60px;
    height: auto;
  }
`;

export const NavWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;

  margin-top: 32px;
  margin-bottom: 32px;
`;

export const NavItem = styled.button`
  display: flex;
  padding: 10px 12px;
  box-sizing: border-box;
  & img {
    width: 20px;
    height: 20px;
  }
`;

export const ActionContainer = styled.div`
  position: fixed;
  bottom: 5rem;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 92px;
  z-index: 10;
`;

export const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.125rem;
  width: 92px;
  height: 80px;
  border-radius: 0 16px 16px 0;
  opacity: 0.92;
  background: var(--Main-Orange-Orange_01, #ff6e3f);
  box-shadow: 0 0 8px 0 rgba(251, 107, 76, 0.2);
  border: none;
  color: ${({ theme }) => theme.colors.Bg};
  ${({ theme }) => theme.fonts.Bold12};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    opacity: 1;
    transform: scale(1.01);
    //살짝 키우기
  }
  img {
    width: 2rem;
  }
`;
