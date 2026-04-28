// mypage/components/BottomActions.tsx
import * as S from "../MyPage.styled";

// MyPage.tsx에서 아이콘을 넘겨주므로, 내부 임포트는 제거합니다.
type Props = {
    onClickReset: () => void;
    onClickLogout: () => void;
    resetIcon: string;
    logoutIcon: string;
};

const BottomActions = ({ onClickReset, onClickLogout, resetIcon, logoutIcon }: Props) => {
    return (
        <S.BottomContainer>
            {/* 기존 QrContainer 스타일 컴포넌트를 재사용하거나, S.ResetContainer 등으로 MyPage.styled.ts에서 수정해서 사용하세요 */}
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