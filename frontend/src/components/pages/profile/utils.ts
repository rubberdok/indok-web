export const suggestNames = (name: string): { suggestedFirstName: string; suggestedLastName: string } => {
  const names = name.split(" ");
  if (names.length === 1) return { suggestedFirstName: name, suggestedLastName: "" };
  return {
    suggestedFirstName: names.slice(0, Math.floor(names.length / 2)).join(" "),
    suggestedLastName: names.slice(Math.floor(names.length / 2)).join(" "),
  };
};
