import * as S from './SideBar.styled';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { ROUTE_PATHS } from '@constants/routeConstants';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTableSelection } from '../../context/TableSelectionContext';
import Toast from '@components/ToastMessage/Toast';

import NavItem from './_components/NavItem';
import { resetTable } from '@pages/tableView/_apis/resetTable';
import { mergeTable } from '@pages/tableView/_apis/mergeTable';

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState(location.pathname);
  const { selectedTables, clearSelection } = useTableSelection();

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const isTableViewPage = location.pathname === ROUTE_PATHS.TABLE_VIEW;

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!isTableViewPage && selectedTables.length > 0) {
      clearSelection();
    }
  }, [isTableViewPage, selectedTables.length, clearSelection]);

  const handleNavClick = (path: string) => {
    setActiveNav(path);
    navigate(path);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const handleResetClick = async () => {
    try {
      await resetTable(selectedTables);
      showToast(`${selectedTables.join(', ')}번 테이블이 초기화되었습니다.`);
      clearSelection();
    } catch (e: any) {
      alert(e.message || '초기화에 실패했습니다.');
    }
  };

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
          <img src={IMAGE_CONSTANTS.SIDECHARACTER} alt="logo" />
        </S.LogoWrapper>

        <S.NavWrapper>
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_HOME}
            activeIcon={IMAGE_CONSTANTS.NAV_HOME_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.HOME}
            onClick={() => handleNavClick(ROUTE_PATHS.HOME)}
            alt="home"
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_TABLE}
            activeIcon={IMAGE_CONSTANTS.NAV_TABLE_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.TABLE_VIEW}
            onClick={() => handleNavClick(ROUTE_PATHS.TABLE_VIEW)}
            alt="table"
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_MENU}
            activeIcon={IMAGE_CONSTANTS.NAV_MENU_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.MENU}
            onClick={() => handleNavClick(ROUTE_PATHS.MENU)}
            alt="menu"
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_COUPON}
            activeIcon={IMAGE_CONSTANTS.NAV_COUPON_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.COUPON}
            onClick={() => handleNavClick(ROUTE_PATHS.COUPON)}
            alt="coupon"
          />
          <NavItem
            icon={IMAGE_CONSTANTS.NAV_MY}
            activeIcon={IMAGE_CONSTANTS.NAV_MY_ACTIVE}
            isActive={activeNav === ROUTE_PATHS.MYPAGE}
            onClick={() => handleNavClick(ROUTE_PATHS.MYPAGE)}
            alt="my"
          />
        </S.NavWrapper>

        {isTableViewPage && selectedTables.length > 0 && (
          <S.ActionContainer>
            <S.ActionButton onClick={handleResetClick}>
              <img src={IMAGE_CONSTANTS.Broom_Icon} alt="초기화" />
              초기화
            </S.ActionButton>

            {selectedTables.length >= 2 && (
              <S.ActionButton onClick={handleMergeClick}>
                <img src={IMAGE_CONSTANTS.Merge_Icon} alt="병합" />
                병합
              </S.ActionButton>
            )}
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