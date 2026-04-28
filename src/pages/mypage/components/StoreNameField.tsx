import InfoRow from "./InfoRow";
import * as S from "../MyPage.styled";
import FieldActions from "./FieldActions";

// 한글 완성형/자모(자음, 모음), 영문, 숫자, 공백 + 기존 안전 특수문자 허용
const STORE_NAME_ALLOWED_CHAR_REGEX =
    /[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/g;

type Props = {
    value?: string;
    editing: boolean;
    input: string;
    setInput: (v: string) => void;
    onEdit: () => void;
    onConfirm: () => void;
    onCancel: () => void;
};

const StoreNameField = ({
    value, editing, input, setInput, onEdit, onConfirm, onCancel
    }: Props) => {
    const handleStoreNameChange = (nextValue: string) => {
        const filtered = nextValue.match(STORE_NAME_ALLOWED_CHAR_REGEX)?.join("") ?? "";
        setInput(filtered);
    };

    return (
        <InfoRow label="주점명">
        {editing ? (
            <>
            <S.NameInput value={input} onChange={(e) => handleStoreNameChange(e.target.value)} />
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", marginRight: "1.6875rem" }}>
                <FieldActions editing={editing} onEdit={onEdit} onConfirm={onConfirm} onCancel={onCancel} />
            </div>
            </>
        ) : (
            <>
            <S.Value>{value || "-"}</S.Value>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", marginRight: "1.6875rem" }}>
                <FieldActions editing={editing} onEdit={onEdit} onConfirm={onConfirm} onCancel={onCancel} />
            </div>
            </>
        )}
        </InfoRow>
    );
};
export default StoreNameField;