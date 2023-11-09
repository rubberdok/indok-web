import { createContext, useContext } from "react";

type StepContextType = {
  activeStep: number;
  steps: number;
  nextStep: () => void;
  previousStep: () => void;
};

export const StepContext = createContext<StepContextType>({
  activeStep: 0,
  steps: 0,
  nextStep: () => {},
  previousStep: () => {},
});

export function useStepContext() {
  return useContext(StepContext);
}
