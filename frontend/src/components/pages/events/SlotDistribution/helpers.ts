export const addId = (
  slotDistribution: { grades: number[]; availableSlots: number }[]
): { grades: number[]; availableSlots: number; id: number }[] => {
  return slotDistribution.map((dist: { grades: number[]; availableSlots: number }, index: number) => {
    return { ...dist, id: index };
  });
};
