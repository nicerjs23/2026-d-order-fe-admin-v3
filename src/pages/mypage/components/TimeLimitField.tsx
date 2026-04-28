import React from "react";
import InfoRow from "./InfoRow"; 
import * as S from "../MyPage.styled";
import FieldActions from "./FieldActions";
import Dropdown from "./Dropdown";
import drop from "../../../assets/icons/drop.svg";

type Props = {
    editing: boolean;
    valueLabel: string;
    setValueLabel: (v: string) => void;
    isDropdownOpen: boolean;
    setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonlyValueLabel?: string;
    onEdit: () => void;
    onConfirm: () => void;
    onCancel: () => void;
};

const TIME_OPTIONS = ["1시간", "1시간 30분", "2시간", "2시간 30분", "3시간"];

const TimeLimitField = ({
    editing, valueLabel, setValueLabel, isDropdownOpen, setDropdownOpen, readonlyValueLabel,
    onEdit, onConfirm, onCancel
}: Props) => {
    return (
        <InfoRow label="테이블 이용 시간">
            {editing ? (
                <S.BanckContainer>
                    {/* ✅ 수정: DropButton을 없애고 ColorSection 안에 화살표를 넣음 + onClick 부여 */}
                    <S.ColorSection onClick={() => setDropdownOpen(prev => !prev)}>
                        {valueLabel}
                        <img src={drop} alt="dropdown" />
                    </S.ColorSection>
                    
                    {isDropdownOpen && (
                        <S.DropdownWrapper>
                            <Dropdown
                                value={valueLabel}
                                options={TIME_OPTIONS}
                                placeholder="시간 선택"
                                isOpen={isDropdownOpen}
                                setIsOpen={setDropdownOpen}
                                onChange={(e) => { setValueLabel(e.target.value); setDropdownOpen(false); }}
                            />
                        </S.DropdownWrapper>
                    )}
                </S.BanckContainer>
            ) : (
                <S.ColorSection>{readonlyValueLabel}</S.ColorSection>
            )}

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", marginRight: "1.6875rem" }}>
                <FieldActions editing={editing} onEdit={onEdit} onConfirm={onConfirm} onCancel={onCancel} />
            </div>
        </InfoRow>
    );
};

export default TimeLimitField;