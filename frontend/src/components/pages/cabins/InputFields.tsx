import React from "react";
import { Composition, Only } from "atomic-layout";
import { Card } from "./Card";
import Input from "@components/ui/Input";
import Button from "../../ui/Button";

const templateMobile = `
  input input
  input input
  button 
`;

const templateTablet = `
  input input
  input input
  button 
`;

interface InputFieldsProps {
    refs: React.RefObject<HTMLInputElement>[];
    children: JSX.Element | JSX.Element[];
}

export const InputFields = ({ refs, children }: InputFieldsProps): JSX.Element => {
    return (
        <Card>
            <Composition
                //templateXs={templateTablet}
                //templateLg={templateMobile}
                templateColsMdOnly="minmax(100px, 1fr) 1fr"
                padding={15}
                gutter={15}
                gutterLg={25}
            >
                <Input type="text" required={true} placeholder="Fornavn" ref={refs[0]}></Input>
                <Input type="text" required={true} placeholder="Etternavn" ref={refs[1]}></Input>
                <Input type="email" required={true} placeholder="E-postadresse" ref={refs[2]}></Input>
                <Input type="number" required={true} placeholder="Mobilnummer" ref={refs[3]}></Input>
                {children}
            </Composition>
        </Card>
    );
};
