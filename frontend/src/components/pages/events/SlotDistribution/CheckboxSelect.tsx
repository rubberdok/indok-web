import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

type Props = {
  id: number;
  usedGrades: number[];
  grades: number[];
  availableSlots: number;
  onAvailableSlotsUpdate: (id: number, newAvailableSlots: number, grades: number[]) => void;
  onGradesUpdate: (id: number, newGrades: number[]) => void;
  onRemove: (id: number) => void;
};

/**
 * Component for a single distribution (allowed grades and available slots)
 */
const CheckboxSelect: React.FC<Props> = ({
  id,
  usedGrades,
  grades,
  availableSlots,
  onAvailableSlotsUpdate,
  onGradesUpdate,
  onRemove,
}) => {
  const handleChange = (year: number) => {
    if (grades.includes(year)) {
      onGradesUpdate(
        id,
        grades.filter((grade) => grade !== year)
      );
      return;
    }
    onGradesUpdate(id, [...grades, year]);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend" id="select-certain-grade-years-label">
            Trinn
          </FormLabel>
          <Grid container spacing={6}>
            {[1, 2, 3, 4, 5].map((year: number) => (
              <Grid item xs={2} key={year}>
                <Tooltip
                  disableHoverListener={grades.includes(year) || !usedGrades.includes(year)}
                  disableFocusListener={grades.includes(year) || !usedGrades.includes(year)}
                  title="Hvert trinn kan kun være i en fordeling"
                >
                  <FormControlLabel
                    checked={grades.includes(year)}
                    value={year}
                    control={<Checkbox color="primary" disableRipple />}
                    label={`${year}.`}
                    onChange={(e) => handleChange(Number((e.target as unknown as { value: string }).value))}
                    disabled={!grades.includes(year) && usedGrades.includes(year)}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <InputLabel>Antall plasser</InputLabel>
            <TextField
              type="number"
              value={availableSlots === 0 ? "" : availableSlots.toString()}
              onChange={(e) => onAvailableSlotsUpdate(id, Number(e.target.value), grades)}
            />
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Fjern fordeling" arrow>
              <IconButton aria-label="delete" onClick={() => onRemove(id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CheckboxSelect;
