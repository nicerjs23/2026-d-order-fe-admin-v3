import styled from 'styled-components';

export const Wrapper = styled.form`
  min-width: 600px;
  max-width: 700px;
  width: 80%;

  display: flex;
  flex-direction: column;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.Gray01};
  border-radius: 10px;
`;

export const ModalBody = styled.div`
  box-sizing: border-box;
  overflow-y: auto;
  padding: 1.5rem 1.5rem 0 1.5rem;
  justify-content: center;
  ${({ theme }) => theme.fonts.SemiBold16}
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.fonts.ExtraBold18}
  color: ${({ theme }) => theme.colors.Black01};
  padding-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.Black02};
`;

export const ele = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  div {
    display: flex;
    flex-direction: row;
    gap: 3rem;
  }

  .custom-label {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  input[type='radio'] {
    -webkit-appearance: none; // 웹킷 브라우저에서 기본 스타일 제거
    -moz-appearance: none; // 모질라 브라우저에서 기본 스타일 제거
    appearance: none; // 기본 브라우저에서 기본 스타일 제거
    width: 18px;
    height: 18px;
    border: 1px solid ${({ theme }) => theme.colors.Black02}; // 체크되지 않았을 때의 테두리 색상
    border-radius: 50%;
    outline: none; // focus 시에 나타나는 기본 스타일 제거
    cursor: pointer;
  }

  // 체크될 시에, 변화되는 스타일 설정
  input[type='radio']:checked {
    background-color: ${({ theme }) =>
      theme.colors.Orange01}; // 체크 시 내부 원으로 표시될 색상
    border: 3px solid white; // 테두리가 아닌, 테두리와 원 사이의 색상
    box-shadow: 0 0 0 1.6px ${({ theme }) => theme.colors.Orange01}; // 얘가 테두리가 됨
    // 그림자로 테두리를 직접 만들어야 함 (퍼지는 정도를 0으로 주면 테두리처럼 보입니다.)
    // 그림자가 없으면 그냥 설정한 색상이 꽉 찬 원으로만 나옵니다.
  }
  img {
    width: 170px;
  }
`;

export const inputText = styled.input<{ $hasError?: boolean }>`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.Black02};
  padding: 1rem;
  ${({ theme }) => theme.fonts.SemiBold16}
  border: 1px solid ${({ $hasError, theme }) =>
    $hasError ? theme.colors.Error : theme.colors.Black02};
  &::placeholder {
    color: ${({ theme }) => theme.colors.Focused};
  }

  &.error {
    border: 1px solid red;
  }
`;

export const FormContentWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 1rem 0;

  max-height: 450px;
  overflow-y: auto;
`;

export const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.Black02};
  span {
    color: ${({ theme }) => theme.colors.Orange01};
    ${({ theme }) => theme.fonts.SemiBold16}
    vertical-align: super;
    font-size: 0.7em;
    margin-left: 2px;
  }
`;

export const OtherText = styled.p`
  color: ${({ theme }) => theme.colors.Black02};
  ${({ theme }) => theme.fonts.SemiBold14}
`;

export const ModalConfirmContainer = styled.div`
  grid-row: 2/3;

  display: flex;
  flex-direction: row;
  border-top: 1px solid ${({ theme }) => theme.colors.Black02};
  button {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.Orange01};
    &:disabled {
      color: ${({ theme }) => theme.colors.Black02};
    }
  }
  button:nth-child(1) {
    ${({ theme }) => theme.fonts.SemiBold16}
    border-right: 1px solid ${({ theme }) => theme.colors.Black02};
  }
  button:nth-child(2) {
    ${({ theme }) => theme.fonts.ExtraBold16}
  }
`;

//
export const BtnClose = styled.button`
  display: flex;
  margin-left: auto;
  width: 16px;
  height: 16px;
`;
export const TopModalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${({ theme }) => theme.fonts.ExtraBold18}
`;
export const DividerLine = styled.div`
  display: flex;
  height: 1px;
  width: 100%;
  background-color: rgba(192, 192, 192, 0.5);
  margin: 2rem 0 1rem 0;
`;

export const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.Black01};
  cursor: pointer;
`;
export const BottomBtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${({ theme }) => theme.colors.Black02};
  border-radius: 0 0 10px 10px;
  overflow: hidden;
`;
export const BottomBtn = styled.button`
  display: flex;
  width: 50%;
  height: 60px;
  border: none;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.Gray01};

  ${({ theme }) => theme.fonts.Bold18}
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.Gray02 : theme.colors.Orange01};

  cursor: pointer;

  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.colors.Black02};
  }
`;

//card

export const MenuCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative; // 오버레이 포지셔닝을 위해 추가
  width: 190px;
  height: 273px;

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
  overflow: hidden;
  & img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 10px;
    transform: scale(1.3);
    transform-origin: center center;
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
  padding: 0 6px;
  box-sizing: border-box;
  min-width: 69px;
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
  gap: 8px;
`;
export const CardText = styled.div`
  ${({ theme }) => theme.fonts.SemiBold12};
  color: ${({ theme }) => theme.colors.Focused};

  &.bold {
    ${({ theme }) => theme.fonts.Bold14};
    color: ${({ theme }) => theme.colors.Black01};
  }

  &.name {
    flex: 1 1 0;
    min-width: 0;
  }

  &.wrap {
    white-space: normal;
  }

  &.price {
    flex: none;
    white-space: nowrap;
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

export const WarningText = styled.div`
  display: flex;
  ${({ theme }) => theme.fonts.Medium12};
  color: ${({ theme }) => theme.colors.Error};
`;
