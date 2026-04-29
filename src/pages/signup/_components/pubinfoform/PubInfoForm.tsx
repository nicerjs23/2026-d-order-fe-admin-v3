import * as S from './PubInfoForm.styled';
import { useState, useMemo } from 'react';
import CommonInput from '../inputs/CommonInput';
import NextButton from '../buttons/NextButton';
import CommonDropdown from '../inputs/dropdown/CommonDropdown';
import SelectBoxInput from '../inputs/selectbutton/SelectButton';

type Props = {
  formData: {
    pubName: string;
    tableCount: string;
    tableFee: string;
    tableFeePolicy: string; // 'PP' | 'PT' | 'NO'
    maxTime: string;
  };
  onChange: (key: keyof Props['formData'], value: string) => void;
  onNext: () => void;
  pubStage: number;
  setPubStage: React.Dispatch<React.SetStateAction<number>>;
};

const isValidPubName = (name: string) => {
  const trimmed = name.trim();
  // 완성형 한글 + 호환 자모(초성·중성·종성 단독 입력) + 영숫자·공백
  return /^[가-힣\u3131-\u318Ea-zA-Z0-9 ]{1,20}$/.test(trimmed);
};
const isValidTableCount = (value: string) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 200;
};
const isValidTableFee = (value: string) => {
  const number = Number(value);
  return !isNaN(number) && number >= 1000 && number <= 50000;
};

const feePolicyOptions = [
  { label: '인원 수', value: 'PP' },
  { label: '테이블', value: 'PT' },
  { label: '받지 않음', value: 'NO' },
];

const PubInfoForm = ({
  formData,
  onChange,
  onNext,
  pubStage,
  setPubStage,
}: Props) => {
  const { pubName, tableCount, tableFee, tableFeePolicy, maxTime } = formData;

  // 메시지 상태
  const [pubNameError, setPubNameError] = useState<string | null>(null);
  const [pubNameSuccess, setPubNameSuccess] = useState<string | null>(null);
  const [tableCountError, setTableCountError] = useState<string | null>(null);
  const [tableCountSuccess, setTableCountSuccess] = useState<string | null>(
    null,
  );
  const [tableFeeError, setTableFeeError] = useState<string | null>(null);
  const [tableFeeSuccess, setTableFeeSuccess] = useState<string | null>(null);

  // ---- 유효성(Boolean) 계산 ----
  const isPubNameValid = useMemo(
    () => !!pubName && isValidPubName(pubName),
    [pubName],
  );
  const isTableCountValid = useMemo(
    () => !!tableCount && isValidTableCount(tableCount),
    [tableCount],
  );

  // 정책이 NO면 이용료는 비검증/비필수
  const isTableFeeRequired = useMemo(
    () => pubStage >= 2 && tableFeePolicy !== 'NO',
    [pubStage, tableFeePolicy],
  );
  const isTableFeeValid = useMemo(
    () => !isTableFeeRequired || (!!tableFee && isValidTableFee(tableFee)),
    [isTableFeeRequired, tableFee],
  );

  const isFirstValid = isPubNameValid && isTableCountValid;
  const isSecondValid = !!tableFeePolicy && isTableFeeValid;

  // ---- 렌더 ----
  return (
    // onKeyDown 제거: 즉시검증 + 버튼 진행만 사용
    <S.Wrapper>
      {pubStage === 1 && (
        <>
          <CommonInput
            label="주점명"
            placeholder="예) 동국주점"
            value={pubName}
            onChange={(e) => {
              const value = e.target.value;
              onChange('pubName', value);

              if (!value) {
                setPubNameError(null);
                setPubNameSuccess(null);
              } else if (isValidPubName(value)) {
                setPubNameError(null);
                setPubNameSuccess('사용 가능한 주점명이에요!');
              } else {
                setPubNameError(
                  '1~20자 이내의 한글, 영문, 숫자를 입력해 주세요.',
                );
                setPubNameSuccess(null);
              }
            }}
            error={pubNameError ?? undefined}
            success={pubNameSuccess ?? undefined}
            helperText="1~20자 이내의 한글, 영문, 숫자를 입력해 주세요."
            onClear={() => {
              onChange('pubName', '');
              setPubNameError(null);
              setPubNameSuccess(null);
            }}
          />

          <CommonInput
            label="테이블 개수"
            placeholder="예) 12"
            value={tableCount}
            onChange={(e) => {
              // 숫자 외 문자 입력 방지(선택): 필요 없으면 이 줄 제거
              const value = e.target.value.replace(/[^\d]/g, '');
              onChange('tableCount', value);

              if (!value) {
                setTableCountError(null);
                setTableCountSuccess(null);
              } else if (isValidTableCount(value)) {
                setTableCountError(null);
                setTableCountSuccess('사용 가능한 테이블 개수에요!');
              } else {
                setTableCountError('1~200 사이의 숫자를 입력해 주세요.');
                setTableCountSuccess(null);
              }
            }}
            error={tableCountError ?? undefined}
            success={tableCountSuccess ?? undefined}
            helperText="1~200 사이의 숫자만 입력할 수 있어요."
            onClear={() => {
              onChange('tableCount', '');
              setTableCountError(null);
              setTableCountSuccess(null);
            }}
          />

          <NextButton disabled={!isFirstValid} onClick={() => setPubStage(2)}>
            다음
          </NextButton>
        </>
      )}

      {pubStage === 2 && (
        <>
          <CommonInput
            label="테이블 이용료"
            placeholder={isTableFeeRequired ? '예) 8000' : '받지 않음 선택됨'}
            value={isTableFeeRequired ? tableFee : ''}
            onChange={(e) => {
              // 숫자만
              const value = e.target.value.replace(/[^\d]/g, '');
              onChange('tableFee', value);

              if (!isTableFeeRequired) {
                setTableFeeError(null);
                setTableFeeSuccess(null);
                return;
              }

              if (!value) {
                setTableFeeError(null);
                setTableFeeSuccess(null);
              } else if (isValidTableFee(value)) {
                setTableFeeError(null);
                setTableFeeSuccess('사용 가능한 이용료예요!');
              } else {
                setTableFeeError('1000~50000 사이의 숫자를 입력해 주세요.');
                setTableFeeSuccess(null);
              }
            }}
            error={
              isTableFeeRequired ? (tableFeeError ?? undefined) : undefined
            }
            success={
              isTableFeeRequired ? (tableFeeSuccess ?? undefined) : undefined
            }
            helperText={
              isTableFeeRequired
                ? '테이블 1개당 요금 (1000~50000원)을 입력해 주세요.'
                : '이용료를 받지 않습니다.'
            }
            onClear={() => {
              onChange('tableFee', '');
              setTableFeeError(null);
              setTableFeeSuccess(null);
            }}
            disabled={!isTableFeeRequired}
          />

          <SelectBoxInput
            label="테이블 이용료 적용 기준"
            value={tableFeePolicy}
            onChange={(val) => {
              onChange('tableFeePolicy', val);
              // 정책이 NO로 바뀌면 금액 메시지 초기화
              if (val === 'NO') {
                setTableFeeError(null);
                setTableFeeSuccess(null);
                onChange('tableFee', ''); // 금액 비움
              }
            }}
            options={feePolicyOptions}
          />

          <NextButton disabled={!isSecondValid} onClick={() => setPubStage(3)}>
            다음
          </NextButton>
        </>
      )}

      {pubStage === 3 && (
        <>
          <CommonDropdown
            label="최대 이용 가능 시간"
            placeholder="시간 선택"
            value={maxTime}
            onChange={(e) => onChange('maxTime', e.target.value)}
            // 210(3시간 30분) 라벨을 쓰길래 options에도 포함해둠
            options={['60', '90', '120', '150', '180', '210']}
            optionLabelMap={{
              '60': '1시간',
              '90': '1시간 30분',
              '120': '2시간',
              '150': '2시간 30분',
              '180': '3시간',
              '210': '3시간 30분',
            }}
          />

          <NextButton disabled={!maxTime} onClick={onNext}>
            다음
          </NextButton>
        </>
      )}
    </S.Wrapper>
  );
};

export default PubInfoForm;
