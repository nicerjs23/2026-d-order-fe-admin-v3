import styled from 'styled-components';

export const MenuCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative; // 오버레이 포지셔닝을 위해 추가
  width: 200px;
  height: 300px;

  border: none;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.Gray01};
  padding: 19px 0;
  box-sizing: border-box;
`;
// 품절 상태를 표시할 오버레이 컴포넌트
export const SoldOutOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  padding-top: 30px;
  box-sizing: border-box;

  z-index: 10;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1.5px solid rgba(192, 192, 192, 0.3);
  background: rgba(255, 255, 255, 0.5);

  color: ${({ theme }) => theme.colors.Orange01};
`;
export const SoldOutText = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.Orange01};
  ${({ theme }) => theme.fonts.ExtraBold18};
`;

export const CardContents = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 154px;
  gap: 9px;
`;

export const CardImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 154px;
  height: 154px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.Bg};
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;
export const DefaultCardImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 154px;
  height: 154px;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.Bg};

  & img {
    width: 100px;
    height: auto;
  }
`;
// 새로운 삭제 버튼 스타일 추가
export const DeleteBtn = styled.button`
  z-index: 12;
  position: absolute;
  top: -10px;
  right: -15px;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 19px;
    height: 19px;
  }
`;
export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;
export const MenuEditBtn = styled.button`
  z-index: 12;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 69px;
  height: 19px;
  gap: 6px;
  border-radius: 10px;
  background-color: rgba(192, 192, 192, 0.3);
  white-space: nowrap;
  padding: 0 6px; /* 내용과 테두리 사이 여백 지정 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
  min-width: 69px; /* 최소 너비 지정 */
  ${({ theme }) => theme.fonts.SemiBold10}
  color: ${({ theme }) => theme.colors.Focused};
  &img {
    width: 11px;
    height: 11px;
  }
`;
export const CardTextInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
export const CardText = styled.div`
  display: flex;
  ${({ theme }) => theme.fonts.SemiBold12};
  color: ${({ theme }) => theme.colors.Black02};
  &.bold {
    box-sizing: border-box;
    max-width: 90px;
    ${({ theme }) => theme.fonts.Bold14};
    color: ${({ theme }) => theme.colors.Black01};
  }
`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
`;
