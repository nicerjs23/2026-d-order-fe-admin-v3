import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.div`
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Focused};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input`
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Black01};
  width: 100%;
  padding: 1rem;
  padding-right: 2.25rem;
  border: 1px solid rgba(192, 192, 192, 0.5);
  border-radius: 25px;
  box-sizing: border-box;

  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }

  -webkit-appearance: none;
  appearance: none;

  &::placeholder {
    ${({ theme }) => theme.fonts.SemiBold16};
    color: ${({ theme }) => theme.colors.Focused};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.White};
  }
`;

export const Icon = styled.img`
  position: absolute;
  right: 12px;
  width: 24px;
  cursor: pointer;
  pointer-events: auto;
`;
