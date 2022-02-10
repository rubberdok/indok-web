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
  category: number[];
  availableSlots: number;
  onAvailableSlotsUpdate: (id: number, newAvailableSlots: number, category: number[]) => void;
  onCategoryUpdate: (id: number, newCategory: number[]) => void;
  onRemove: (id: number) => void;
};

/**
 * Component for a single distribution category
 */
const CheckboxSelect: React.FC<Props> = ({
  id,
  usedGrades,
  category,
  availableSlots,
  onAvailableSlotsUpdate,
  onCategoryUpdate,
  onRemove,
}) => {
  const handleChange = (year: number) => {
    if (category.includes(year)) {
      onCategoryUpdate(
        id,
        category.filter((cat) => cat !== year)
      );
      return;
    }
    onCategoryUpdate(id, [...category, year]);
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
                  disableHoverListener={category.includes(year) || !usedGrades.includes(year)}
                  disableFocusListener={category.includes(year) || !usedGrades.includes(year)}
                  title="Hvert trinn kan kun være i en fordeling"
                >
                  <FormControlLabel
                    checked={category.includes(year)}
                    value={year}
                    control={<Checkbox color="primary" disableRipple />}
                    label={`${year}.`}
                    onChange={(e) => handleChange(Number((e.target as unknown as { value: string }).value))}
                    disabled={!category.includes(year) && usedGrades.includes(year)}
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
              onChange={(e) => onAvailableSlotsUpdate(id, Number(e.target.value), category)}
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
