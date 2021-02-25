import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { CheckBox } from "@material-ui/icons";

const CabinSelector = () => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Assign responsibility</FormLabel>
      <FormGroup>
        <FormControlLabel control={<Checkbox name="gilad" />} label="Gilad Gray" />
        <FormControlLabel control={<Checkbox name="jason" />} label="Jason Killian" />
        <FormControlLabel control={<CheckBox name="antoine" />} label="Antoine Llorca" />
      </FormGroup>
      <FormHelperText>Be careful</FormHelperText>
    </FormControl>
  );
};

export default CabinSelector;
