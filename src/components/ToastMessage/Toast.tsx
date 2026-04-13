// src/components/toast/Toast.tsx
import React, { useEffect } from 'react';
import * as S from './Toast.styled';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    icon?: string;
    variant?: 'default' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, icon, variant }) => {
    useEffect(() => {
        // isVisible이 true가 되면 3초 뒤에 onClose 함수를 실행하여 팝업을 닫음
        if (isVisible) {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        // 컴포넌트가 언마운트되거나 재실행될 때 타이머 정리(메모리 누수 방지)
        return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    // 보이지 않는 상태면 아무것도 렌더링하지 않음
    if (!isVisible) return null;

    return (
        <S.ToastWrapper $variant={variant}>
            {icon && <S.ToastIcon src={icon} alt="" />}
            {message}
        </S.ToastWrapper>
    );
};

export default Toast;