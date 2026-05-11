// mypage/components/BottomActions.tsx
import * as S from "../MyPage.styled";

type Props = {
    onClickServer: () => void;
    onClickCustomer: () => void;
    onClickReset: () => void;
    onClickLogout: () => void;
    serverIcon: string;
    customerIcon: string;
    resetIcon: string;
    logoutIcon: string;
};

const BottomActions = ({ onClickServer, onClickCustomer, onClickReset, onClickLogout, serverIcon, customerIcon, resetIcon, logoutIcon }: Props) => {
    return (
        <S.BottomContainer>
            <S.QrContainer onClick={onClickServer}>
                <S.QrImg src={serverIcon} alt="서버 바로가기" />
                <span>서버 바로가기</span>
            </S.QrContainer>

            <S.QrContainer onClick={onClickCustomer}>
                <S.QrImg src={customerIcon} alt="커스터머 바로가기" />
                <span>커스터머 바로가기</span>
            </S.QrContainer>

            <S.QrContainer onClick={onClickReset}>
                <S.QrImg src={resetIcon} alt="데이터 포맷" />
                <span>데이터 포맷</span>
            </S.QrContainer>

            <S.LogoutContainer onClick={onClickLogout}>
                <S.LogoutImg src={logoutIcon} alt="로그아웃" />
                <span>로그아웃</span>
            </S.LogoutContainer>
        </S.BottomContainer>
    );
};

export default BottomActions;