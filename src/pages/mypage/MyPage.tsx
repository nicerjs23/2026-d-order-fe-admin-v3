// mypage/MyPage.tsx
import * as S from './MyPage.styled';
import { useEffect, useState, useCallback } from 'react';
import Modal from './components/Modal';
import { toast } from 'react-toastify';
import check from '../../assets/icons/toastcheck.svg';

import { getManagerInfo } from './apis/getManagers';
import { patchManagerInfo, type BoothMyPageData } from './apis/getManagerPatch';
import { downloadManagerQRGrid, getManagerQRUrl } from './apis/getQRDownload';
import { requestLogout } from './apis/logout';
import { redirectToLoginPage } from '@utils/redirectToLoginPage';
import { resetTableData } from './apis/resetTableData';
import { LoadingSpinner } from '../menu/api/LoadingSpinner';

import StoreNameField from './components/StoreNameField';
import SeatFeeField from './components/SeatFeeField';
import TimeLimitField from './components/TimeLimitField';
import AccountField from './components/AccountField';
import ReadonlyField from './components/ReadonlyField'; // ✅ ReadonlyField 다시 사용
import BottomActions from './components/BottomActions';

import QR_icon from "@assets/icons/QR_icon.svg";
import DataReset from "@assets/icons/dataReset.svg";
import MypageLogout from "@assets/icons/mypage_logout.svg";
import ServerIcon from "@assets/icons/serverIcon.png";
import CustomerIcon from "@assets/icons/customerIcon.png";

const SeatTypeLabel: Record<BoothMyPageData['seat_type'], string> = { PP: '인원 수', PT: '테이블', NO: '받지 않음' };
const LabelToSeatType: Record<string, BoothMyPageData['seat_type']> = { '인원 수': 'PP', 테이블: 'PT', '받지 않음': 'NO' };

const hoursToLabel = (h?: string | number) => {
  const hours = Number(h);
  switch (hours) { case 1: return '1시간'; case 1.5: return '1시간 30분'; case 2: return '2시간'; case 2.5: return '2시간 30분'; case 3: return '3시간'; default: return '2시간'; }
};
const labelToHours = (label: string) => {
  switch (label) { case '1시간': return 1; case '1시간 30분': return 1.5; case '2시간': return 2; case '2시간 30분': return 2.5; case '3시간': return 3; default: return 2; }
};

// ✅ tableCount 제거됨
type PatchField = 'storeName' | 'account' | 'seat' | 'time'; 

const MyPage = () => {
  const [my, setMy] = useState<BoothMyPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [editingAccount, setEditingAccount] = useState(false);
  const [editingSeat, setEditingSeat] = useState(false);
  const [editingTime, setEditingTime] = useState(false);

  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isSeatDropdownOpen, setIsSeatDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [owner, setOwner] = useState('');
  const [account, setAccount] = useState('');

  const [seatTypeLocal, setSeatTypeLocal] = useState<BoothMyPageData['seat_type']>('NO');
  const [seatTypeLabel, setSeatTypeLabel] = useState<string>('받지 않음');
  const [seatAmountLocal, setSeatAmountLocal] = useState<string>('');

  const [timeLabelLocal, setTimeLabelLocal] = useState<string>('2시간');

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getManagerInfo();
      if (res?.data) setMy(res.data);
    } catch (err: any) {
      setError(err?.message || '주점 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    if (!my) return;
    if (!editingName) setStoreName(my.name ?? '');
    if (!editingAccount) {
      setSelectedBank(my.bank ?? ''); setOwner(my.depositor ?? ''); setAccount(my.account ?? '');
    }
    if (!editingSeat) {
      setSeatTypeLocal(my.seat_type);
      setSeatTypeLabel(SeatTypeLabel[my.seat_type as keyof typeof SeatTypeLabel] ?? '받지 않음');
      const amt = my.seat_type === 'PP' ? (my.seat_fee_person ?? 0) : my.seat_type === 'PT' ? (my.seat_fee_table ?? 0) : 0;
      setSeatAmountLocal(String(amt || ''));
    }
    if (!editingTime) setTimeLabelLocal(hoursToLabel(my.table_limit_hours));
  }, [my, editingName, editingAccount, editingSeat, editingTime]);

  useEffect(() => {
    setSeatTypeLocal(LabelToSeatType[seatTypeLabel as keyof typeof LabelToSeatType] ?? 'NO');
  }, [seatTypeLabel]);

  const startEdit = (f: PatchField) => {
    if (!my) return;
    if (f === 'storeName') setEditingName(true);
    if (f === 'account') setEditingAccount(true);
    if (f === 'seat') setEditingSeat(true);
    if (f === 'time') setEditingTime(true);
  };

  const cancelEdit = (f: PatchField) => {
    if (!my) return;
    if (f === 'storeName') { setEditingName(false); setStoreName(my.name ?? ''); }
    if (f === 'account') { setEditingAccount(false); setSelectedBank(my.bank ?? ''); setOwner(my.depositor ?? ''); setAccount(my.account ?? ''); }
    if (f === 'seat') {
      setEditingSeat(false); setSeatTypeLocal(my.seat_type); setSeatTypeLabel(SeatTypeLabel[my.seat_type as keyof typeof SeatTypeLabel] ?? '받지 않음');
      const amt = my.seat_type === 'PP' ? (my.seat_fee_person ?? 0) : my.seat_type === 'PT' ? (my.seat_fee_table ?? 0) : 0;
      setSeatAmountLocal(String(amt || ''));
    }
    if (f === 'time') { setEditingTime(false); setTimeLabelLocal(hoursToLabel(my.table_limit_hours)); }
  };

  const confirmEdit = async (f: PatchField) => {
    if (!my) return;
    const payload: Partial<BoothMyPageData> = {};
    if (f === 'storeName') payload.name = storeName.trim();
    else if (f === 'account') { payload.bank = selectedBank.trim(); payload.depositor = owner.trim(); payload.account = account.trim(); }
    else if (f === 'seat') {
      payload.seat_type = seatTypeLocal;
      const amount = seatAmountLocal.trim() === '' ? undefined : Number(seatAmountLocal.trim());
      if (seatTypeLocal === 'PP') { payload.seat_fee_person = typeof amount === 'number' ? amount : 0; payload.seat_fee_table = 0; }
      else if (seatTypeLocal === 'PT') { payload.seat_fee_table = typeof amount === 'number' ? amount : 0; payload.seat_fee_person = 0; }
      else { payload.seat_fee_person = 0; payload.seat_fee_table = 0; }
    }
    else if (f === 'time') payload.table_limit_hours = labelToHours(timeLabelLocal);

    try {
      setUpdating(true);
      const res = await patchManagerInfo(payload);
      if (!res) throw new Error('수정 결과가 없습니다.');
      toast.success('저장되었습니다.', { icon: <img src={check} alt="체크" />, closeButton: false, style: toToastStyle() });
      await reload();
      if (f === 'storeName') {
        setEditingName(false);
        window.setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      if (f === 'account') setEditingAccount(false);
      if (f === 'seat') setEditingSeat(false);
      if (f === 'time') setEditingTime(false);
    } catch (e: any) {
      toast.error(e?.message || '수정 중 오류가 발생했습니다.', { closeButton: false, style: toToastStyle() });
    } finally { setUpdating(false); }
  };

  const toToastStyle = () => ({ backgroundColor: '#FF6E3F', color: '#FAFAFA', fontSize: '1rem', fontWeight: 800 as const, borderRadius: '8px', padding: '0.75rem 0.875rem' });

  const getServiceUrl = (service: 'server' | 'customer') => {
    const hostname = window.location.hostname;
    if (hostname.endsWith('.netlify.app')) {
      return `https://${hostname.replace('-admin', `-${service}`)}/`;
    }
    return `https://${service}.dorder-api.shop/`;
  };

  const handleServerShortcut = () => {
    window.open(getServiceUrl('server'), '_blank');
  };

  const handleCustomerShortcut = async () => {
    try {
      const qrUrl = await getManagerQRUrl();
      const match = qrUrl.match(/booth_([a-f0-9-]+)_qr\.png/);
      if (!match) throw new Error('부스 식별자를 찾을 수 없습니다.');
      window.open(`${getServiceUrl('customer')}?id=${match[1]}`, '_blank');
    } catch (err: any) {
      toast.error(err?.message || '커스터머 페이지를 열 수 없습니다.', { closeButton: false, style: toToastStyle() });
    }
  };

  const handleQrClick = async () => {
    try {
      await downloadManagerQRGrid(my?.name ?? '');
      toast.success('QR코드 다운로드가 완료되었어요!', { icon: <img src={check} alt="체크" />, closeButton: false, style: toToastStyle() });
    } catch (err: any) {
      toast.error(err?.message || 'QR코드 다운로드에 실패했습니다.', { closeButton: false, style: toToastStyle() });
    }
  };

  const handleLogout = async () => {
    try {
      await requestLogout();
      localStorage.removeItem('accessToken'); 
      toast.success('로그아웃되었습니다.', { closeButton: false, style: toToastStyle() });
      redirectToLoginPage();
    } catch (err: any) {
      toast.error(err?.message || '로그아웃에 실패했습니다.', { closeButton: false, style: toToastStyle() });
      redirectToLoginPage();
    } finally { setShowLogoutModal(false); }
  };

  const handleReset = async () => {
    try {
      const res = await resetTableData();
      toast.success(`데이터 포맷이 완료되었습니다. (삭제: ${res.data?.deleted_count}개)`, { icon: <img src={check} alt="체크" />, closeButton: false, style: toToastStyle() });
      await reload(); 
    } catch (err: any) {
      toast.error(err?.message || '데이터 포맷에 실패했습니다.', { closeButton: false, style: toToastStyle() });
    } finally { setShowResetModal(false); }
  };

  if (loading || updating) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;
  if (!my) return <div>주점 정보를 불러올 수 없습니다.</div>;

  return (
    <S.Wrapper>
      <S.TitleContainer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <S.Title style={{ marginBottom: 0 }}>주점 정보</S.Title>
        <button onClick={handleQrClick} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#BDBDBD', cursor: 'pointer', fontSize: '14px' }}>
          <img src={QR_icon} alt="QR" style={{ width: '20px' }} />
          QR 코드 다운로드
        </button>
      </S.TitleContainer>
      
      <S.Container>
        <S.Row>
          <StoreNameField
            value={my.name} editing={editingName} input={storeName} setInput={setStoreName}
            onEdit={() => startEdit('storeName')} onConfirm={() => confirmEdit('storeName')} onCancel={() => cancelEdit('storeName')}
          />
          <S.Divider />
          {/* ✅ 다시 ReadonlyField로 원상복구! */}
          <ReadonlyField label="테이블 수" value={my.table_max_cnt} />
          <S.Divider />
          <SeatFeeField
            editing={editingSeat} seatTypeLabel={seatTypeLabel} setSeatTypeLabel={setSeatTypeLabel} amount={seatAmountLocal} setAmount={setSeatAmountLocal}
            readonlyType={my.seat_type} readonlyPP={my.seat_fee_person} readonlyPT={my.seat_fee_table}
            isDropdownOpen={isSeatDropdownOpen} setDropdownOpen={setIsSeatDropdownOpen}
            onEdit={() => startEdit('seat')} onConfirm={() => confirmEdit('seat')} onCancel={() => cancelEdit('seat')}
          />
          <S.Divider />
          <TimeLimitField
            editing={editingTime} valueLabel={timeLabelLocal} setValueLabel={setTimeLabelLocal}
            isDropdownOpen={isTimeDropdownOpen} setDropdownOpen={setIsTimeDropdownOpen} readonlyValueLabel={hoursToLabel(my.table_limit_hours)}
            onEdit={() => startEdit('time')} onConfirm={() => confirmEdit('time')} onCancel={() => cancelEdit('time')}
          />
          <S.Divider /> 
          <AccountField
            editing={editingAccount} bank={selectedBank} setBank={setSelectedBank} owner={owner} setOwner={setOwner} account={account} setAccount={setAccount}
            isDropdownOpen={isBankDropdownOpen} setDropdownOpen={setIsBankDropdownOpen} readonlyBank={my.bank} readonlyOwner={my.depositor} readonlyAccount={my.account}
            onEdit={() => startEdit('account')} onConfirm={() => confirmEdit('account')} onCancel={() => cancelEdit('account')}
          />
        </S.Row>
      </S.Container>

      <BottomActions
        onClickServer={handleServerShortcut}
        onClickCustomer={handleCustomerShortcut}
        onClickReset={() => setShowResetModal(true)}
        onClickLogout={() => setShowLogoutModal(true)}
        serverIcon={ServerIcon}
        customerIcon={CustomerIcon}
        resetIcon={DataReset}
        logoutIcon={MypageLogout}
      />

      {showLogoutModal && <Modal title="정말 로그아웃 하시겠습니까?" onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} confirmText="로그아웃" />}
      {showResetModal && <Modal title="정말 데이터를 포맷하시겠습니까?" onCancel={() => setShowResetModal(false)} onConfirm={handleReset} confirmText="포맷하기" />}
    </S.Wrapper>
  );
};

export default MyPage;