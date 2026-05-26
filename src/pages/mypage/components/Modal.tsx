// mypage/components/Modal.tsx
import styled from "styled-components";

type ModalProps = {
  title: string;
  subtitle?: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const Modal = ({ title, subtitle, confirmText, onCancel, onConfirm }: ModalProps) => {
  return (
    <Overlay onClick={onCancel}>
      {/* e.stopPropagation()을 통해 모달 내부 클릭 시 닫히지 않도록 방지 */}
      <Container onClick={(e) => e.stopPropagation()}>
        <TitleArea>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleArea>
        <Bottom>
          <Cancel onClick={onCancel}>취소</Cancel>
          <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>
        </Bottom>
      </Container>
    </Overlay>
  );
};

export default Modal;

const Overlay = styled.section`
  position: fixed;
  top: 0;
  left: 0%;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 23.75rem;
  min-height: 9.75rem;
  background-color: ${({ theme }) => theme.colors.Gray01};
  border-radius: 0.875rem;
  z-index: 1000;
  cursor: default; /* 컨테이너 내부는 기본 커서 유지 */
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex: 1;
  padding: 1.5rem 1rem;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  ${({ theme }) => theme.fonts.Bold20};
`;

const Subtitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.Gray03};
  ${({ theme }) => theme.fonts.Medium14};
`;

const Bottom = styled.div`
  display: flex;
  height: 3.375rem;
  border-top: 0.5px solid ${({ theme }) => theme.colors.Black02};
`;

const Cancel = styled.div`
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.Orange01};
  ${({ theme }) => theme.fonts.Medium16};
  border-right: 0.5px solid ${({ theme }) => theme.colors.Black02};
`;

const ConfirmButton = styled.div`
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.Orange01};
  ${({ theme }) => theme.fonts.Medium16};
`;