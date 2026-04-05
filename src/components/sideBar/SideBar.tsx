import * as S from './SideBar.styled';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { ROUTE_PATHS } from '@constants/routeConstants';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTableSelection } from '../../context/TableSelectionContext';
import Toast from '@components/ToastMessage/Toast';

//경로설정하고 useNavigate 추가하기

import NavItem from './_components/NavItem';
import { resetTable } from '@pages/tableView/_apis/resetTable';
import { mergeTable } from '@pages/tableView/_apis/mergeTable';

const SideBar = () => {
  const location = useLocation(); // 현재 경로 가져오기
  const navigate = useNavigate(); // navigate 훅 사용
  const [activeNav, setActiveNav] = useState(location.pathname); // 활성화된 네비게이션 상태
  const { selectedTables, clearSelection } = useTableSelection(); //체크박스 선택 전역상태 가져오기
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path: string) => {
    setActiveNav(path); // 클릭한 경로로 활성화 상태 변경
    navigate(path); // 해당 경로로 이동
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  // 초기화 버튼 클릭 핸들러
  const handleResetClick = async () => {
    try {
      await resetTable(selectedTables);
      showToast(`${selectedTables.join(', ')}번 테이블이 초기화되었습니다.`);
      clearSelection();
      // (추후 웹소켓이 연결되면 여기서 목록이 자동 갱신됩니다)
    } catch (e: any) {
      alert(e.message || '초기화에 실패했습니다.');
    }
  };

  // 병합 버튼 클릭 핸들러
  const handleMergeClick = async () => {
    if (selectedTables.length < 2) {
      alert('병합할 테이블을 2개 이상 선택해주세요.');
      return;
    }
    try {
      const res = await mergeTable(selectedTables);
      const repNum = res.data.representive_table_num;
      showToast(`테이블이 ${repNum}번으로 병합되었습니다.`);
      clearSelection();
    } catch (e: any) {
      alert(e.message || '병합에 실패했습니다.');
    }
  };

  return (
    <>
      <S.SideBarWrapper>
        <S.LogoWrapper>
          <img src={IMAGE_CONSTANTS.SIDECHARACTER} alt='logo' />
        </S.LogoWrapper>
        <S.NavWrapper>
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_HOME}
            activeIcon={IMAGE_CONSTANTS.NAV_HOME_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.HOME} //추후에 라우터경로로변경
            onClick={() => handleNavClick(ROUTE_PATHS.HOME)}
            alt='home'
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_TABLE}
            activeIcon={IMAGE_CONSTANTS.NAV_TABLE_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.TABLE_VIEW}
            onClick={() => handleNavClick(ROUTE_PATHS.TABLE_VIEW)}
            alt='table'
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_MENU}
            activeIcon={IMAGE_CONSTANTS.NAV_MENU_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.MENU}
            onClick={() => handleNavClick(ROUTE_PATHS.MENU)}
            alt='menu'
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_COUPON}
            activeIcon={IMAGE_CONSTANTS.NAV_COUPON_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.COUPON}
            onClick={() => handleNavClick(ROUTE_PATHS.COUPON)}
            alt='coupon'
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_MY}
            activeIcon={IMAGE_CONSTANTS.NAV_MY_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.MYPAGE}
            onClick={() => handleNavClick(ROUTE_PATHS.MYPAGE)}
            alt='my'
          />
          {/* <NavItem
            icon={IMAGE_CONSTANTS.NAV_DASHBOARD}
            activeIcon={IMAGE_CONSTANTS.NAV_DASHBOARD_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.DASHBOARD}
            onClick={() => handleNavClick(ROUTE_PATHS.DASHBOARD)}
            alt="dashboard"
          /> */}
        </S.NavWrapper>
        {/* 🌟 선택된 테이블이 있을 때만 버튼 노출 */}
        {selectedTables.length > 0 && (
          <S.ActionContainer>
            <S.ActionButton onClick={handleResetClick}>
              <img src={IMAGE_CONSTANTS.Broom_Icon}></img>
              초기화
            </S.ActionButton>
            <S.ActionButton onClick={handleMergeClick}>
              <img src={IMAGE_CONSTANTS.Merge_Icon}></img>
              병합
            </S.ActionButton>
          </S.ActionContainer>
        )}
      </S.SideBarWrapper>
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </>
  );
};

export default SideBar;
