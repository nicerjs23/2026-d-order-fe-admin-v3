import { useState } from "react";
import styled, { css } from "styled-components";

interface Props {
    menuName: string;
    initialQuantity: number;
    onClose: () => void;
    onConfirmRequest: (quantity: number) => void;
}

const CancelMenuModal: React.FC<Props> = ({
    menuName,
    initialQuantity,
    onClose,
    onConfirmRequest,
    }) => {
    const [quantity, setQuantity] = useState(0);

    return (
        <Overlay>
        <ModalWrapper>
            <Header>
            <p>주문 취소할 메뉴 수량을 선택해 주세요</p>
            </Header>
            <MainWrapper>
            <Box>
                <p className="grayText">메뉴</p>
                <RightBox>{menuName}</RightBox>
            </Box>
            <Box>
                <p className="grayText">수량</p>
                <RightBox>
                <QuantityWrapper>
                    <button
                    id="Decrease"
                    onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                    disabled={quantity <= 0}
                    >
                    -
                    </button>
                    <span>{quantity}</span>
                    <button
                    id="Increase"
                    onClick={() =>
                        setQuantity((q) => Math.min(initialQuantity, q + 1))
                    }
                    disabled={quantity >= initialQuantity}
                    >
                    +
                    </button>
                </QuantityWrapper>
                </RightBox>
            </Box>
            </MainWrapper>
            <ButtonRow>
            <ButtonContainer1>
                <button onClick={onClose}>취소</button>
            </ButtonContainer1>
            <ButtonContainer2>
                <button
                onClick={() => {
                    // 상위로 수량만 넘김, Confirm Modal 띄우는 건 상위의 역할
                    onClose();
                    onConfirmRequest(quantity);
                }}
                disabled={quantity === 0}
                >
                주문 취소
                </button>
            </ButtonContainer2>
            </ButtonRow>
        </ModalWrapper>
        </Overlay>
    );
};

export default CancelMenuModal;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalWrapper = styled.div`
    position: fixed;
    top: 40%;
    left: 50%;
    min-width: 24rem;
    min-height: 16rem;
    transform: translate(-50%, -30%);
    background: white;
    /* padding: 0.2rem 0; */
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

const Header = styled.div`
    width: 100%;
    padding: 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.Black02};
    ${({ theme }) => css(theme.fonts.Bold20)};
`;
const MainWrapper = styled.div`
    width: 100%;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.Black02};
    `;

    const Box = styled.div`
    width: 19rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .grayText {
        color: ${({ theme }) => theme.colors.Black02};
        ${({ theme }) => css(theme.fonts.SemiBold16)};
    }
`;

const RightBox = styled.div`
    min-width: 5.5rem;
    width: fit-content;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${({ theme }) => theme.colors.Black01};
    ${({ theme }) => css(theme.fonts.Bold16)};
`;

const QuantityWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    color: ${({ theme }) => theme.colors.Black01};
    ${({ theme }) => css(theme.fonts.ExtraBold18)};

    button {
        width: 20px;
        height: 20px;
        padding: 0;
        line-height: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 50%;
        font-size: 0.7rem;
        font-weight: 900;
        color: ${({ theme }) => theme.colors.Orange01};
        background-color: #ff6e3f4d;

        &:disabled {
        background-color: #C0C0C033;
        color: #000000;
        cursor: not-allowed;
        }
    }
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 3.5rem;
`;

const ButtonContainer1 = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.Orange01};
    border-right: 1px solid ${({ theme }) => theme.colors.Black02};
    button {
        color: ${({ theme }) => theme.colors.Orange01};
        ${({ theme }) => css(theme.fonts.Medium16)};
    }
`;

const ButtonContainer2 = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.Orange01};

    button {
        color: ${({ theme }) => theme.colors.Orange01};
        ${({ theme }) => css(theme.fonts.Bold16)};

        &:disabled {
        color: ${({ theme }) => theme.colors.Black02};
        opacity: 0.4;
        cursor: not-allowed;
        }
    }
`;
