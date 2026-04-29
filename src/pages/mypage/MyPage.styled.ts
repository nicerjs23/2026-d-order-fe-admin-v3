// mypage/MyPage.styled.ts
import styled from "styled-components";

export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    width: 87%;
    margin-top: 2.25rem;
    margin-left: 3.0625rem;
    background-color: ${({ theme }) => theme.colors.Bg};
`;
export const TitleContainer = styled.div`
    ${({ theme }) => theme.fonts.Bold14};

`;

export const Title = styled.div`
    ${({ theme }) => theme.fonts.ExtraBold20};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 2.1875rem;
`;

// 공통 Input 스타일
export const Input = styled.input`
    border-radius: 0.375rem;
    max-width: 5rem;
    ${({ theme }) => theme.fonts.Bold16};
    background-color: ${({ theme }) => theme.colors.Bg};
    border: 1px solid rgba(192, 192, 192, 0.5);
    padding: 0.3rem 0.5rem;
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1rem;
    font-weight: 700;
    outline: none;

    &:focus {
        border: 1px solid ${({ theme }) => theme.colors.Orange01};
    }
`;

export const AccountInput = styled(Input)`
    max-width: 10rem;
`;

export const NameInput = styled(Input)`
    min-width: 8rem;
    max-width: 300px;
    padding: 0.5rem 0.75rem;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(192, 192, 192, 0.50);
    border-radius: 0.625rem 0.625rem 0 0;
    background-color: #FFFFFF;
`;

export const Row = styled.section`
    display: flex;
    flex-direction: column;
`;

export const Value = styled.div`
    ${({ theme }) => theme.fonts.Bold16};
    color: ${({ theme }) => theme.colors.Black01};
    font-size: 1rem;
    font-weight: 700;
    flex: 1;
`;

export const FeeTag = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
    ${({ theme }) => theme.fonts.Bold16};
    height: 2rem;
    padding: 0 1rem;
    border-radius: 0.3125rem;
    margin-right: 0.625rem;
`;

export const BanckContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
    margin-right: 0.625rem;
`;

export const ColorSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.Orange00};
    color: ${({ theme }) => theme.colors.Orange01};
    ${({ theme }) => theme.fonts.Bold16};
    height: 2rem;
    padding: 0 1rem;
    border-radius: 0.3125rem;
    gap: 0.3rem; /* 화살표와 텍스트 간격 */
    cursor: pointer;
`;

export const OwnerTag = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(192, 192, 192, 0.30);
    color: ${({ theme }) => theme.colors.Focused};
    ${({ theme }) => theme.fonts.Bold16};
    height: 2rem;
    border-radius: 0.3125rem;
    padding: 0 0.8rem;
    margin-right: 0.625rem;
`;

export const DropdownWrapper = styled.div`
    position: absolute;
    top: 100%; 
    left: 0;
    width: 10.188rem;
    z-index: 99;
    border-radius: 5px;
    margin-top: 0.2rem;
`;

export const DropButton = styled.div`
    display: flex;
    align-items: center;
`;

export const Drop = styled.img`
    width: 0.8rem;
    height: 0.8rem;
`;

// 버튼 스타일 시안에 맞게 전면 수정
export const ModifyButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    border: 1px solid rgba(192, 192, 192, 0.8);
    background-color: #FFFFFF;
    width: 3.375rem;
    height: 2.5rem;
    cursor: pointer;

    span {
        color: ${({ theme }) => theme.colors.Black02};
        ${({ theme }) => theme.fonts.SemiBold16};
    }
`;

export const ConfirmButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.Orange01};
    border: none;
    width: 3.375rem;
    height: 2.5rem;
    cursor: pointer;

    span {
        color: #FFFFFF;
        ${({ theme }) => theme.fonts.SemiBold16};
    }
`;

export const CancelButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    border: 1px solid rgba(192, 192, 192, 0.8);
    background-color: #FFFFFF;
    width: 3.375rem;
    height: 2.5rem;
    cursor: pointer;

    span {
        color: ${({ theme }) => theme.colors.Black02};
        ${({ theme }) => theme.fonts.SemiBold16};
    }
`;

export const BottomContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    gap: 1.4rem;
    padding-right: 1rem;
`;

export const QrContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    span {
        color: ${({ theme }) => theme.colors.Gray02};
        ${({ theme }) => theme.fonts.Bold14};
    }
`;

export const QrImg = styled.img`
    width: 1.125rem;
`;

export const LogoutContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    span {
        color: ${({ theme }) => theme.colors.Gray02};
        ${({ theme }) => theme.fonts.Bold14};
    }
`;
export const LogoutImg = styled.img`
    width: 1.125rem;
`;

export const Divider = styled.div`
    display: flex;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid rgba(192, 192, 192, 0.5);
`;