// tableView/_components/tableCard.tsx
import * as S from './tableComponents.styled';
import { TABLEPAGE_CONSTANTS } from '../_constants/tableConstants';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { useState, useEffect, useCallback } from 'react';
import { useTableSelection } from '../../../context/TableSelectionContext';

// tableGrid에서 넘겨주는 데이터 타입을 여기서 명확히 정의하여 import 에러(순환참조 등) 방지
export interface TableCardData {
  tableNumber: number;
  status: "AVAILABLE" | "IN_USE" | string;
  totalAmount: number;
  orders: { menu: string; quantity: number }[];
  startedAt: string | null;
  group: { representativeTable: number } | null;
}

interface Props {
  data: TableCardData;
  limitHours: number | null;
  isHighlighted?: boolean;
  onGoToRepresentative?: (repNum: number) => void;
  onSelect?: () => void;
  onShowToast?: (message: string, variant?: 'default' | 'error') => void;
}

const TableCard: React.FC<Props> = ({
  data,
  limitHours,
  isHighlighted,
  onGoToRepresentative,
  onSelect,
  onShowToast,
}) => {
  const { selectedTables, toggleTableSelection } = useTableSelection();
  const isSelected = selectedTables.includes(data.tableNumber); 
  
  // 🌟 병합 여부 판단
  const isMerged = !!data.group;
  const repNum = data.group?.representativeTable;
  const isChild = isMerged && repNum !== data.tableNumber;
  const isInUse = data.status === "IN_USE";

  // 병합된 테이블이면 🔗 기호를 붙이고, 자식 테이블이면 대표 번호를 표시
  // ex) 2번(대표), 7번(자식), 32번(자식) 모두 "🔗 T 02"로 표시됨
  const displayTitle = isMerged 
    ? (isChild ? `🔗 T ${String(repNum).padStart(2, '0')}` : `T ${String(data.tableNumber).padStart(2, '0')} 👑`)
    : `T ${String(data.tableNumber).padStart(2, '0')}`;

  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  
  // 첫 주문 시간 기반으로 경과 시간 및 초과 여부 계산 로직
  const checkTimeAndStatus = useCallback(() => {
    // 자식 테이블은 시간을 계산하지 않음 (대표 테이블만 보여주면 됨)
    if (isChild || data.status !== "IN_USE") {
      setElapsedTime("00:00");
      setIsOverdue(false);
      return;
    }

    if (!data.startedAt) {
      setElapsedTime("00:00");
      setIsOverdue(false);
      return;
    }

    const startedDate = new Date(data.startedAt);

    if (Number.isNaN(startedDate.getTime())) {
      setElapsedTime("00:00");
      setIsOverdue(false);
      return;
    }

    const diffInMs = Date.now() - startedDate.getTime();
    if (diffInMs <= 0) {
      setElapsedTime("00:00");
      setIsOverdue(false);
      return;
    }

    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    setElapsedTime(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    );

    if (limitHours && limitHours > 0) {
      setIsOverdue(totalMinutes >= limitHours * 60);
    } else {
      setIsOverdue(false);
    }
  }, [data.status, data.startedAt, limitHours, isChild]);

  // 실시간 업데이트 (1분마다 계산)
  useEffect(() => {
    checkTimeAndStatus(); // 초기 계산

    const timer = setInterval(() => {
      checkTimeAndStatus();
    }, 60000);

    return () => clearInterval(timer);
  }, [checkTimeAndStatus]);
  
  const handleTableInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isChild) {
      if (repNum && onGoToRepresentative) {
        onGoToRepresentative(repNum);
      }
      return;
    }

    toggleTableSelection(data.tableNumber);
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isChild) return;
    toggleTableSelection(data.tableNumber);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 체크박스 클릭 시 상세페이지 진입 방지
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    // 병합된 자식 테이블(e.g., 7번, 32번)을 클릭한 경우 대표 테이블로 캐러셀 이동
    if (isChild && repNum && onGoToRepresentative) {
      onGoToRepresentative(repNum);
      return; 
    }
    
    // 빈 테이블 차단 (입장시간 없고 주문도 없는 경우)
    if (!data.startedAt && data.orders.length === 0) {
      onShowToast?.("주문 내역이 없는 빈 테이블입니다.", "error");
      return;
    }

    if (onSelect) onSelect(); 
  };

  return (
    <S.CardWrapper 
      $isOverdue={isOverdue} 
      $isSelected={isSelected}
      onClick={handleCardClick}
      // Styled-components 타입 에러를 방지하기 위해 style 속성으로 하이라이트 효과 직접 부여
      style={isHighlighted ? {
        boxShadow: "0 0 20px 5px rgba(255, 215, 0, 0.8)",
        border: "2px solid #FFD700",
        transform: "scale(1.02)",
        transition: "all 0.3s ease-out"
      } : { transition: "all 0.3s ease-out" }}
    >
      <S.TableInfo $isOverdue={isOverdue} onClick={handleTableInfoClick}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 종속된 자식 테이블은 체크박스를 숨겨서 중복 선택 및 초기화 오류 방지 */}
          {!isChild && (
            <input 
              type="checkbox" 
              checked={isSelected}
              readOnly
              onClick={handleCheckboxClick}
            />
          )}
          <p className="tableNumber">{displayTitle}</p>
        </div>
        {/* 병합된 자식 테이블은 시간 표시 생략 */}
        <p className="orderTime">{!isChild && isInUse ? elapsedTime : ""}</p>
      </S.TableInfo>
      
      <S.DivideLine />
      <S.MenuContainer>
        <S.MenuList>
          {data.orders.length === 0 && (
            <S.EmptyImage src={IMAGE_CONSTANTS.SIDECHARACTER} alt="빈 테이블" />
          )}

          {data.orders.slice(0, 3).map((order, idx) => (
            <S.ItemRow key={idx}>
              <S.MenuItem>
                <p className="menuName">{order.menu}</p>
                <p className="menuAmount">{order.quantity}</p>
              </S.MenuItem>
              <img
                src={TABLEPAGE_CONSTANTS.TABLE.IMAGE.MENU_LINE}
                alt="구분선"
              />
            </S.ItemRow>
          ))}
        </S.MenuList>
        {data.orders.length > 0 && <S.ToDetail>더보기</S.ToDetail>}
      </S.MenuContainer>

      <S.TotalPrice>
        <p className="totalPrice">총 금액 {data.totalAmount.toLocaleString()}원</p>
      </S.TotalPrice>
    </S.CardWrapper>
  );
};

export default TableCard;
