export const getFormattedDataAndErrors = (
  eventData: Record<string, any>,
  isAttendable: boolean,
  hasSlotDistribution: boolean,
  slotDistribution: { category: number[]; availableSlots: number }[]
): Record<string, any> => {
  const eventInput = formatEventData(eventData);
  const attendableInput = formatAttendableData(eventData, slotDistribution, hasSlotDistribution);

  let currentErrors: string[] = [];

  if (!eventInput.title || !eventInput.description || !eventInput.startTime) {
    currentErrors = [...currentErrors, "Tittel, beskrivelse og starttid er påkrevd"];
  }
  if (isAttendable && !attendableInput.signupOpenDate) {
    currentErrors = [...currentErrors, "Når påmeldingen åpner er påkrevd for arrangementer med påmelding"];
  }
  if (
    isAttendable &&
    hasSlotDistribution &&
    slotDistribution.reduce((res, dist) => (res = res + dist.availableSlots), 0) < Number(eventData.availableSlots)
  ) {
    currentErrors = [
      ...currentErrors,
      "Totalt antall plasser kan ikke være større enn summen av antall i hver gruppe i plassfordelingen",
    ];
  }
  if (isAttendable && !attendableInput.totalAvailableSlots) {
    currentErrors = [...currentErrors, "Antall plasser er påkrevd for arrangementer med påmelding"];
  }

  return { eventInput, attendableInput, currentErrors };
};

const formatEventData = (eventData: Record<string, any>) => {
  const eventInputData = {
    title: eventData.title === "" ? undefined : eventData.title,
    description: eventData.description === "" ? undefined : eventData.description,
    startTime: eventData.startTime === "" ? undefined : eventData.startTime,
    organizationId: eventData.organizationId === "" ? undefined : eventData.organizationId,
    endTime: eventData.endTime === "" ? undefined : eventData.endTime,
    location: eventData.location === "" ? undefined : eventData.location,
    categoryId: eventData.categoryId === "" ? undefined : eventData.categoryId,
    image: eventData.image === "" ? undefined : eventData.image,
    shortDescription: eventData.shortDescription === "" ? undefined : eventData.shortDescription,
    contactEmail: eventData.contactEmail === "" ? undefined : eventData.contactEmail,
    allowedGradeYears: eventData.allowedGradeYears === "" ? undefined : eventData.allowedGradeYears,
  };

  return eventInputData;
};

const formatAttendableData = (
  eventData: Record<string, any>,
  slotDistributionInput: { category: number[]; availableSlots: number }[],
  hasSlotDistribution: boolean
) => {
  const slotDistribution: Record<string, number> = {};

  if (hasSlotDistribution) {
    const slotDistributionWithStringCategories = slotDistributionInput.map((dist) => {
      const stringCategory = dist.category.sort((a, b) => a - b).reduce((res, grade) => `${res},${grade}`, "");
      return { category: stringCategory.slice(1, stringCategory.length), availableSlots: dist.availableSlots };
    });

    slotDistributionWithStringCategories.forEach((slot) => {
      slotDistribution[slot.category] = slot.availableSlots;
    });

    const attendableInputData = {
      signupOpenDate: eventData.signupOpenDate === "" ? undefined : eventData.signupOpenDate,
      bindingSignup: eventData.bindingSignup === "" ? undefined : eventData.bindingSignup,
      deadline: eventData.deadline === "" ? undefined : eventData.deadline,
      hasExtraInformation: eventData.hasExtraInformation === "" ? undefined : eventData.hasExtraInformation,
      totalAvailableSlots: eventData.availableSlots === "" ? undefined : Number(eventData.availableSlots),
      slotDistribution,
    }; // add price: eventData.price here

    return attendableInputData;
  }

  let allowedGradesString = eventData.allowedGradeYears.reduce((res: string, grade: number) => `${res},${grade}`, "");
  allowedGradesString = allowedGradesString.slice(1, allowedGradesString.length);

  slotDistribution[allowedGradesString] = Number(eventData.availableSlots);

  const attendableInputData = {
    signupOpenDate: eventData.signupOpenDate === "" ? undefined : eventData.signupOpenDate,
    bindingSignup: eventData.bindingSignup === "" ? undefined : eventData.bindingSignup,
    deadline: eventData.deadline === "" ? undefined : eventData.deadline,
    hasExtraInformation: eventData.hasExtraInformation === "" ? undefined : eventData.hasExtraInformation,
    totalAvailableSlots: eventData.availableSlots === "" ? undefined : Number(eventData.availableSlots),
    slotDistribution,
  };

  return attendableInputData;
};
