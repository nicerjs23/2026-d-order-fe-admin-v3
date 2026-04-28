// mypage/components/SeatFeeField.tsx
import React from "react";
import InfoRow from "./InfoRow";
import * as S from "../MyPage.styled";
import FieldActions from "./FieldActions";
import Dropdown from "./Dropdown";
import drop from "../../../assets/icons/drop.svg";

type Props = {
    editing: boolean;
    seatTypeLabel: string;
    setSeatTypeLabel: (label: string) => void;
    amount: string;
    setAmount: (v: string) => void;
    readonlyType?: "PP" | "PT" | "NO";
    readonlyPP?: number | null | undefined;
    readonlyPT?: number | null | undefined;
    isDropdownOpen: boolean;
    setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onEdit: () => void;
    onConfirm: () => void;
    onCancel: () => void;
};

const SEAT_OPTIONS = ["인원 수", "테이블", "받지 않음"];

const SeatFeeField = ({
    editing, seatTypeLabel, setSeatTypeLabel, amount, setAmount,
    readonlyType, readonlyPP, readonlyPT,
    isDropdownOpen, setDropdownOpen,
    onEdit, onConfirm, onCancel
    }: Props) => {
    return (
        <InfoRow label="테이블 이용료">
            {editing ? (
                <>
                <S.BanckContainer>
                    <S.ColorSection onClick={() => setDropdownOpen((prev) => !prev)}>
                    {seatTypeLabel}
                    <S.Drop src={drop} alt="drop" />
                    </S.ColorSection>
                    {isDropdownOpen && (
                    <S.DropdownWrapper>
                        <Dropdown
                        value={seatTypeLabel}
                        options={SEAT_OPTIONS}
                        placeholder="방식 선택"
                        isOpen={isDropdownOpen}
                        setIsOpen={setDropdownOpen}
                        onChange={(e) => {
                            setSeatTypeLabel(e.target.value);
                            setDropdownOpen(false);
                        }}
                        />
                    </S.DropdownWrapper>
                    )}
                </S.BanckContainer>

                {seatTypeLabel !== "받지 않음" ? (
                    <S.AccountInput
                    placeholder="금액"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                    />
                ) : (
                    <S.Value style={{ marginLeft: "0.75rem" }}>이용료 없음</S.Value>
                )}
                </>
            ) : (
                <>
                {readonlyType === "PP" && (
                    <><S.FeeTag>인원 수</S.FeeTag><S.Value>{readonlyPP ? `${readonlyPP.toLocaleString()}원` : "-"}</S.Value></>
                )}
                {readonlyType === "PT" && (
                    <><S.FeeTag>테이블</S.FeeTag><S.Value>{readonlyPT ? `${readonlyPT.toLocaleString()}원` : "-"}</S.Value></>
                )}
                {readonlyType === "NO" && (
                    <><S.FeeTag>받지 않음</S.FeeTag><S.Value>0원</S.Value></>
                )}
                </>
            )}

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", marginRight: "1.6875rem" }}>
                <FieldActions editing={editing} onEdit={onEdit} onConfirm={onConfirm} onCancel={onCancel} />
            </div>
        </InfoRow>
    );
};

export default SeatFeeField;