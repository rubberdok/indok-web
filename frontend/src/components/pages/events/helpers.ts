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

  if (isAttendable && !attendableInput.totalAvailableSlots) {
    currentErrors = [...currentErrors, "Antall plasser er påkrevd for arrangementer med påmelding"];
  }

  if (isAttendable) {
    if (!attendableInput.totalAvailableSlots) {
      currentErrors = [...currentErrors, "Antall plasser er påkrevd for arrangementer med påmelding"];
    }

    if (
      !!attendableInput.totalAvailableSlots &&
      hasSlotDistribution &&
      slotDistribution.reduce((res, dist) => (res = res + dist.availableSlots), 0) < attendableInput.totalAvailableSlots
    ) {
      currentErrors = [
        ...currentErrors,
        "Totalt antall plasser kan ikke være større enn summen av antall i hver gruppe i plassfordelingen",
      ];
    }

    const slotDistGradesString = slotDistribution
      .flatMap((slotDist) => slotDist.category)
      .sort((a, b) => a - b)
      .reduce((res, grade) => `${res},${grade}`, "");
    const allowedGradesString = eventInput.allowedGradeYears.reduce(
      (res: string, grade: number) => `${res},${grade}`,
      ""
    );

    if (
      hasSlotDistribution &&
      slotDistGradesString.slice(1, slotDistGradesString.length) !==
        allowedGradesString.slice(1, allowedGradesString.length)
    ) {
      currentErrors = [...currentErrors, "Hvem det er åpent for må tilsvare plassfordelingen for klassetrinn"];
    }
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
  if (hasSlotDistribution) {
    const slotDistribution = slotDistributionInput.map((dist) => {
      const stringCategory = dist.category.sort((a, b) => a - b).reduce((res, grade) => `${res},${grade}`, "");
      return { gradeGroup: stringCategory.slice(1, stringCategory.length), availableSlots: dist.availableSlots };
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

  const slotDistribution = [{ gradeGroup: allowedGradesString, availableSlots: Number(eventData.availableSlots) }];

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
