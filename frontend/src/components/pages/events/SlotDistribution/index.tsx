import { Button, Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import CheckboxSelect from "./CheckboxSelect";
import { addId } from "./helpers";
import { SlotDistributionDataType } from "../constants";

type Props = {
  slotDistribution: SlotDistributionDataType[];
  onUpdateSlotDistribution: (slotDist: SlotDistributionDataType[]) => void;
};

/**
 * Component for the creating a slot distribution, aka a distribution of the available slots between grade years
 */
const SlotDistribution: React.FC<Props> = ({ slotDistribution, onUpdateSlotDistribution }) => {
  const [slotDistWithId, setSlotDistWithId] = useState<Record<number, SlotDistributionDataType>>(
    addId(slotDistribution)
  );

  const usedGrades: number[] = ([] as number[])
    .concat(...Object.values(slotDistWithId).map((dist) => dist.grades))
    .sort((a, b) => a - b);

  const handleGradesUpdate = (id: number, newGrades: number[]) => {
    const updatedDists: Record<number, SlotDistributionDataType> = {};
    const distToUpdate = slotDistWithId[id];
    updatedDists[id] = { ...distToUpdate, grades: newGrades };

    Object.entries(slotDistWithId)
      .filter((dist) => Number(dist[0]) !== id)
      .map((dist) => {
        updatedDists[Number(dist[0])] = {
          ...dist[1],
          grades: dist[1].grades.filter((grade: number) => !newGrades.includes(grade)),
        };
      });

    const newDist = Object.entries(updatedDists)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map((dist) => {
        return { grades: dist[1].grades, availableSlots: dist[1].availableSlots };
      });
    onUpdateSlotDistribution(newDist);
    setSlotDistWithId(addId(newDist));
  };

  const onAvailableSlotsUpdate = (id: number, newAvailableSlots: number, grades: number[]) => {
    slotDistWithId[id] = { grades, availableSlots: newAvailableSlots };

    const newDist = Object.entries(slotDistWithId)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map((dist) => {
        return { grades: dist[1].grades, availableSlots: dist[1].availableSlots };
      });

    onUpdateSlotDistribution(newDist);
    setSlotDistWithId(addId(newDist));
  };

  const handleRemove = (id: number) => {
    const newDist = Object.entries(slotDistWithId)
      .filter((dist) => Number(dist[0]) !== id)
      .map((dist) => {
        return dist[1];
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

      {Object.entries(slotDistWithId).map((dist) => (
        <CheckboxSelect
          key={Number(dist[0])}
          id={Number(dist[0])}
          usedGrades={usedGrades}
          grades={dist[1].grades}
          availableSlots={dist[1].availableSlots}
          onAvailableSlotsUpdate={onAvailableSlotsUpdate}
          onGradesUpdate={handleGradesUpdate}
          onRemove={handleRemove}
        />
      ))}
    </Grid>
  );
};

export default SlotDistribution;
