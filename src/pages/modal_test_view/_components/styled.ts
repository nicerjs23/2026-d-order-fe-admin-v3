import styled from 'styled-components';

export const Wrapper = styled.form`
  min-width: 600px;
  max-width: 700px;
  width: 80%;

  display: grid;
  grid-template-rows: 1fr auto;

  z-index: 10;
  background-color: ${({ theme }) => theme.colors.Gray01};

  border-radius: 10px;
`;

export const ModalBody = styled.div`
  box-sizing: border-box;
  padding: 1.5rem;
  grid-row: 1/2;

  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${({ theme }) => theme.fonts.SemiBold16}
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

  > div {
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

  > img {
    width: 170px;
  }
`;

export const setComposition = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  button {
    ${({ theme }) => theme.fonts.SemiBold16}
    background-color: ${({ theme }) => theme.colors.Orange01};
    color: ${({ theme }) => theme.colors.Bg};
    border-radius: 10px;
    padding: 0.75em 1.25em;
  }
`;

export const inputText = styled.input`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.Gray02};
  padding: 1rem;
  ${({ theme }) => theme.fonts.SemiBold16}
  outline: none;

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.Black02};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.Focused};
  }

  &.error {
    border: 1px solid red;
  }
`;

export const inputImg = styled.input`
  display: none;
`;

export const UploadImgBox = styled.div`
  display: inline-block;
  border: 1px solid ${({ theme }) => theme.colors.Orange01};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
`;

export const DefaultImgBox = styled.div`
  width: 170px;
  height: 170px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }
`;
export const ImgContainer = styled.div`
  position: relative;
  width: fit-content;
  max-width: 250px;

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: 0;
  }
`;

export const Img = styled.img`
  max-width: 200px;
`;
export const FormContentWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 2rem 0;

  max-height: 450px;
  overflow-y: auto;
  scrollbar-width: none;
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
    padding: 1.25rem 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.Orange01};
    &:disabled {
      ${({ theme }) => theme.fonts.SemiBold16}
      color: ${({ theme }) => theme.colors.Gray02};
    }
  }
  button:nth-child(1) {
    ${({ theme }) => theme.fonts.SemiBold16}
    border-right: 1px solid ${({ theme }) => theme.colors.Black02};
  }
  button:nth-child(2) {
    &:disabled {
      ${({ theme }) => theme.fonts.SemiBold16}
    }
    ${({ theme }) => theme.fonts.ExtraBold16}
  }
`;
