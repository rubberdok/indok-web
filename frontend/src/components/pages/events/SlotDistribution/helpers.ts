export const addId = (
  slotDistribution: { category: number[]; availableSlots: number }[]
): { category: number[]; availableSlots: number; id: number }[] => {
  return slotDistribution.map((dist: { category: number[]; availableSlots: number }, index: number) => {
    return { ...dist, id: index };
  });
};
