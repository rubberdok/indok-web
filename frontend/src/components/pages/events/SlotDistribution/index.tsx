import { Button, Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import CheckboxSelect from "./CheckboxSelect";
import { addId } from "./helpers";

type Props = {
  slotDistribution: { grades: number[]; availableSlots: number }[];
  onUpdateSlotDistribution: (slotDist: { grades: number[]; availableSlots: number }[]) => void;
};

/**
 * Component for the creating a slot distribution, aka a distribution of the available slots between grade years
 */
const SlotDistribution: React.FC<Props> = ({ slotDistribution, onUpdateSlotDistribution }) => {
  const [slotDistWithId, setSlotDistWithId] = useState<{ grades: number[]; availableSlots: number; id: number }[]>(
    addId(slotDistribution)
  );

  const usedGrades: number[] = ([] as number[])
    .concat(...slotDistWithId.map((dist) => dist.grades))
    .sort((a, b) => a - b);

  const handleGradesUpdate = (id: number, newGrades: number[]) => {
    const distToUpdate = slotDistWithId.find((dist) => dist.id === id);

    const updatedDists = slotDistWithId
      .filter((dist) => dist.id !== id)
      .map((dist) => {
        return { ...dist, grades: dist.grades.filter((grade: number) => !newGrades.includes(grade)) };
      });

    const newDist = [...updatedDists, { ...distToUpdate, grades: newGrades }]
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .map((dist) => {
        return { grades: dist.grades, availableSlots: dist.availableSlots ?? 0 };
      });
    onUpdateSlotDistribution(newDist);
    setSlotDistWithId(addId(newDist));
  };

  const onAvailableSlotsUpdate = (id: number, newAvailableSlots: number, grades: number[]) => {
    const index = slotDistWithId.findIndex((dist) => dist.id === id);
    const newDist = [
      ...slotDistribution.slice(0, index),
      { grades: grades, availableSlots: newAvailableSlots },
      ...slotDistribution.slice(index + 1, slotDistribution.length),
    ];
    onUpdateSlotDistribution(newDist);
    setSlotDistWithId(addId(newDist));
  };

  const handleRemove = (id: number) => {
    const newDist = slotDistWithId
      .filter((dist) => dist.id !== id)
      .map((dist) => {
        return { grades: dist.grades, availableSlots: dist.availableSlots };
      });
    onUpdateSlotDistribution(newDist);
    setSlotDistWithId(addId(newDist));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} style={{ paddingLeft: 0 }}>
        <Button
          style={{ margin: 0 }}
          onClick={() => {
            onUpdateSlotDistribution([...slotDistribution, { grades: [], availableSlots: 0 }]);
            setSlotDistWithId(addId([...slotDistribution, { grades: [], availableSlots: 0 }]));
          }}
          color="primary"
          variant="outlined"
          disabled={slotDistribution.length >= 5 || usedGrades.length >= 5}
        >
          <Typography>+ Legg til fordeling</Typography>
        </Button>
      </Grid>

      {slotDistWithId.map(({ grades, availableSlots, id }) => (
        <CheckboxSelect
          key={id}
          id={id}
          usedGrades={usedGrades}
          grades={grades}
          availableSlots={availableSlots}
          onAvailableSlotsUpdate={onAvailableSlotsUpdate}
          onGradesUpdate={handleGradesUpdate}
          onRemove={handleRemove}
        />
      ))}
    </Grid>
  );
};

export default SlotDistribution;
