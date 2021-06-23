import { TextField as MUITextField } from "@material-ui/core";
import { Field } from "formik";


export const TextField: typeof MUITextField & typeof Field = ( {field, form, ...props } ) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  return (
    <MUITextField 
      name={name}
      value={value}
      onChange={(e) => {
        setFieldValue(name, e.target.value)
      }}
      variant={props.variant || "filled"}
      label={props.label || ""}
      type={props.type || "text"}
      error={props.error || false}
      helperText={props.helperText || ""}
    />
  )
}