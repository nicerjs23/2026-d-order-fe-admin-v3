// src/components/sideBar/ToastMessage/Toast.styled.ts
import styled, { keyframes } from "styled-components";

// X축은 항상 -50%를 유지하면서 Y축만 살짝 움직이도록 수정
const fadeAnimation = keyframes`
    0% { opacity: 0; transform: translate(-50%, -40%); }
    10% { opacity: 1; transform: translate(-50%, -50%); }
    90% { opacity: 1; transform: translate(-50%, -50%); }
    100% { opacity: 0; transform: translate(-50%, -60%); }
`;

export const ToastWrapper = styled.div<{ $variant?: 'default' | 'error' }>`
    position: fixed;
    top: 8%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;

    display: inline-flex;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-sizing: border-box;

    width: fit-content;
    min-width: 10.875rem;
    min-height: 3.25rem;

    border-radius: 8px;
    background: ${({ $variant, theme }) =>
        $variant === 'error' ? theme.colors.Black02 : 'var(--Main-Orange-Orange_01, #FF6E3F)'};

    color: #FFF;
    ${({ theme }) => theme.fonts.Bold14};

    animation: ${fadeAnimation} 3s ease-in-out forwards;
    pointer-events: none;
`;

export const ToastIcon = styled.img`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
`;