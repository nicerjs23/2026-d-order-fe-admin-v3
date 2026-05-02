import * as S from './AmountBox.styled';

import ListIcon from '@assets/icons/buttonIcon/icon/Vector.png';

export type AmountItem = {
  menuName: string;
  quantity: number;
};
/** emptyText: 빈 상태 시 표시할 텍스트 */
export type AmountBoxProps = {
  title: string;
  items: AmountItem[];
  emptyText?: string;
};

export default function AmountBox({
  title,
  items,
  emptyText = '집계된 항목이 없어요',
}: AmountBoxProps) {
  const isEmpty = items.length === 0;

  return (
    <S.AmountBoxWrapper>
      <S.Section>
        <S.SectionTitle>
          <S.SectionTitleIcon>
            <img
              src={ListIcon}
              alt=""
              style={{ width: '16px', height: '20px' }}
            />
          </S.SectionTitleIcon>
          {title}
        </S.SectionTitle>
        {isEmpty ? (
          <S.EmptyListArea>
            <S.EmptyListText>{emptyText}</S.EmptyListText>
          </S.EmptyListArea>
        ) : (
          <S.SectionList>
            {items.map((item, index) => {
              const isZero = item.quantity === 0;
              return (
                <S.Row key={index}>
                  <S.MenuName $isZero={isZero}>{item.menuName}</S.MenuName>
                  <S.Quantity $isZero={isZero}>{item.quantity}</S.Quantity>
                </S.Row>
              );
            })}
          </S.SectionList>
        )}
      </S.Section>
    </S.AmountBoxWrapper>
  );
}
