import styled from "styled-components";

const InfoRowComponent = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <InfoRow>
        <Label>{label}</Label>
        <ContentContainer>{children}</ContentContainer>
      </InfoRow>
      {/* <Divider /> */}
    </>
  );
};

export default InfoRowComponent;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 4rem;
`;

export const Label = styled.div`
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Focused};
  font-size: 1rem;
  font-weight: 600;
  font-style: normal;
  line-height: normal;
  width: 9rem;
  margin-right: 1.5625rem;
  margin-left: 1.6875rem;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.75rem;
`;

export const Divider = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background-color: rgba(192, 192, 192, 0.5);
`;
