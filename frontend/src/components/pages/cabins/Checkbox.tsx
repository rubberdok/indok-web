import styled from "styled-components";

interface CheckProps {
    checked: boolean;
    onClick: () => void;
    errorMsg: string;
}

const CheckBox = ({ checked, onClick, errorMsg }: CheckProps): JSX.Element => {
    return (
        <>
            <CheckboxWrapper status={errorMsg}>
                <input type="checkbox" onClick={onClick} onChange={onClick} checked={checked}></input>
                <LabelText>Jeg samtykker til retningslinjene for booking av hytte</LabelText>
            </CheckboxWrapper>
        </>
    );
};

const CheckboxWrapper = styled.label`
    padding: 5px;
    border: ${(props: { status: string }) => (props.status == "" ? "none" : "2px solid red")};
`;

const LabelText = styled.span`
    padding: 5px;
`;

export default CheckBox;
