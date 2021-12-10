export const getFormattedData = (
  eventData: Record<string, any>,
  isAttendable: boolean,
  hasSlotDistribution: boolean,
  slotDistribution: { category: number[]; availableSlots: number }[]
): Record<string, any> => {
  const eventInput = formatEventData(eventData);
  const attendableInput = formatAttendableData(eventData);
  const slotDistributionInput = formatSlotDistributionData(eventData, slotDistribution);

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
    slotDistribution.reduce((res, dist) => (res = res + dist.availableSlots), 0) !== Number(eventData.availableSlots)
  ) {
    currentErrors = [...currentErrors, "Totalt antall plasser må stemme med antall i hver gruppe i plassfordelingen"];
  }
  if (isAttendable && !slotDistributionInput.availableSlots) {
    currentErrors = [...currentErrors, "Antall plasser er påkrevd for arrangementer med påmelding"];
  }

  return { eventInput, attendableInput, slotDistributionInput, currentErrors };
};

const formatEventData = (eventData: Record<string, any>) => {
  const eventInputData = {
    title: eventData.title,
    description: eventData.description,
    startTime: eventData.startTime,
    organizationId: eventData.organizationId,
    endTime: eventData.endTime,
    location: eventData.location,
    categoryId: eventData.categoryId,
    image: eventData.image,
    shortDescription: eventData.shortDescription,
    contactEmail: eventData.contactEmail,
    allowedGradeYears: eventData.allowedGradeYears,
    hasExtraInformation: eventData.hasExtraInformation,
  };
  const eventInput = { ...eventInputData };

  Object.keys(eventInputData).forEach((key) => {
    if (eventInputData[key] === "") {
      eventInput[key] = undefined;
    }
  });

  return eventInput;
};

const formatAttendableData = (eventData: Record<string, any>) => {
  const attendableInputData = {
    signupOpenDate: eventData.signupOpenDate,
    bindingSignup: eventData.bindingSignup,
    deadline: eventData.deadline,
  }; // add price: eventData.price here
  const attendableInput = { ...attendableInputData };

  Object.keys(attendableInputData).forEach((key) => {
    if (attendableInputData[key] === "") {
      attendableInput[key] = undefined;
    }
  });
  return attendableInput;
};

const formatSlotDistributionData = (
  eventData: Record<string, any>,
  slotDistribution: { category: number[]; availableSlots: number }[]
) => {
  const stringSlotDistribution = slotDistribution.map((dist) => {
    const stringCategory = dist.category.sort((a, b) => a - b).reduce((res, grade) => `${res},${grade}`, "");
    return { category: stringCategory.slice(1, stringCategory.length), availableSlots: dist.availableSlots };
  });

  const slotDistributionInputData = { availableSlots: eventData.availableSlots, gradeYears: stringSlotDistribution };
  const slotDistributionInput = { ...slotDistributionInputData };

  Object.keys(slotDistributionInputData).forEach((key) => {
    if (slotDistributionInputData[key] === "") {
      slotDistributionInput[key] = undefined;
    }
  });
  return slotDistributionInput;
};
