import Input from "@components/ui/Input";
import { Composition } from "atomic-layout";
import React from "react";
import { Card } from "./CardC";

// const templateMobile = `
//     input input
//     input input
//     button
// `;

// const templateTablet = `
//   input input
//   input input
//   button
// `;

interface InputFieldsProps {
  refs: React.RefObject<HTMLInputElement>[];
  children: JSX.Element | JSX.Element[];
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const InputFields: React.FC<InputFieldsProps> = ({ onChange, refs, children }) => {
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
        <Input type="text" required={true} placeholder="Fornavn" ref={refs[0]} onChange={onChange}></Input>
        <Input type="text" required={true} placeholder="Etternavn" ref={refs[1]} onChange={onChange}></Input>
        <Input type="email" required={true} placeholder="E-postadresse" ref={refs[2]} onChange={onChange}></Input>
        <Input type="number" required={true} placeholder="Mobilnummer" ref={refs[3]} onChange={onChange}></Input>

        {children}
      </Composition>
    </Card>
  );
};
