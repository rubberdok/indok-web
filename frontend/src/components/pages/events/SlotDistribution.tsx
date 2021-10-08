import React from "react";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";

/**
 * Component for the creating a slot distribution, aka a distribution of the available slots between grade years
 */

interface Props {
  slotDistribution: { category: number[]; availableSlots: number }[];
  onUpdateSlotDistribution: (slotDist: { category: number[]; availableSlots: number }[]) => void;
}

const SlotDistribution: React.FC<Props> = ({ slotDistribution, onUpdateSlotDistribution }) => {
  const onCategoryUpdate = (newCategory: number[], oldCategory: number[]) => {
    const slotDistributionWithIndices = slotDistribution.map((dist, i: number) => {
      return { ...dist, index: i };
    });
    const distToUpdate = slotDistributionWithIndices.find(
      (dist) => JSON.stringify(dist.category) === JSON.stringify(oldCategory)
    );
    const updatedDists = slotDistributionWithIndices
      .filter((dist) => dist.index !== distToUpdate?.index)
      .map((dist) => {
        return { ...dist, category: dist.category.filter((grade) => !newCategory.includes(grade)) };
      });
    const newDist = [...updatedDists, { ...distToUpdate, category: newCategory }]
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((dist) => {
        return { category: dist.category, availableSlots: dist.availableSlots ?? 0 };
      });
    onUpdateSlotDistribution(newDist);
  };

  const onAvailableSlotsUpdate = (newAvailableSlots: number, category: number[]) => {
    const index = slotDistribution.findIndex((dist) => JSON.stringify(dist.category) === JSON.stringify(category));
    onUpdateSlotDistribution([
      ...slotDistribution.slice(0, index),
      { category: category, availableSlots: newAvailableSlots },
      ...slotDistribution.slice(index + 1, slotDistribution.length),
    ]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} style={{ paddingLeft: 0 }}>
        <Button
          style={{ margin: 0 }}
          onClick={() => onUpdateSlotDistribution([...slotDistribution, { category: [], availableSlots: undefined }])}
          color="primary"
          variant="outlined"
          disabled={slotDistribution.length >= 5}
        >
          <Typography>+ Legg til fordeling</Typography>
        </Button>
      </Grid>

      {slotDistribution.map(({ category, availableSlots }, index: number) => (
        <Grid container spacing={3} key={index}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="select-certain-grade-years-label" shrink>
                Trinn
              </InputLabel>
              <Select
                labelId="select-certain-grade-years-label"
                id="select-certain-grade-years"
                name="certain-grade-years"
                value={category}
                multiple
                onChange={(e) => onCategoryUpdate(e.target.value as number[], category)}
                displayEmpty
              >
                {[1, 2, 3, 4, 5].map((year: number) => (
                  <MenuItem key={year} value={year}>
                    {`${year}. klasse`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Antall plasser</InputLabel>
            <TextField
              type="number"
              value={category.length > 0 ? availableSlots : undefined}
              onChange={(e) => onAvailableSlotsUpdate(Number(e.currentTarget.value), category)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              style={{ margin: 0 }}
              onClick={() =>
                onUpdateSlotDistribution(
                  slotDistribution.filter((dist) => JSON.stringify(dist.category) !== JSON.stringify(category))
                )
              }
              color="primary"
            >
              Fjern fordeling
            </Button>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default SlotDistribution;
