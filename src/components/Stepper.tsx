import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress">
      {/* Container with background line */}
      <div className="relative">
        {/* Background line that spans all steps */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" aria-hidden="true">
          {/* Progress line overlay */}
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <ol className="relative flex items-start justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = onStepClick && step.id <= currentStep;

            return (
              <li
                key={step.id}
                className="flex flex-col items-center flex-1"
              >
                {/* Step Button */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex flex-col items-center group",
                    isClickable && "cursor-pointer"
                  )}
                >
                  <span className="flex items-center justify-center">
                    <span
                      className={cn(
                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all duration-300",
                        isCompleted &&
                          "bg-accent border-accent text-accent-foreground",
                        isCurrent &&
                          "border-primary bg-primary text-primary-foreground shadow-lg scale-110",
                        !isCompleted &&
                          !isCurrent &&
                          "border-border text-muted-foreground group-hover:border-primary"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{step.id}</span>
                      )}
                    </span>
                  </span>
                  <span className="mt-3 text-center px-2 max-w-[140px]">
                    <span
                      className={cn(
                        "block text-sm font-medium transition-colors",
                        isCurrent && "text-primary",
                        isCompleted && "text-accent",
                        !isCompleted && !isCurrent && "text-muted-foreground"
                      )}
                    >
                      {step.name}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground break-words">
                      {step.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
