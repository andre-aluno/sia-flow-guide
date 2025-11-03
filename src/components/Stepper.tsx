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
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = onStepClick && step.id <= currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex-1",
                stepIdx !== steps.length - 1 && "pr-8 sm:pr-20"
              )}
            >
              {/* Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div
                  className="absolute top-5 left-[50%] -ml-px h-0.5 w-full"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isCompleted ? "bg-accent" : "bg-border"
                    )}
                  />
                </div>
              )}

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
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isCompleted &&
                        "bg-accent border-accent text-accent-foreground",
                      isCurrent &&
                        "border-primary bg-primary text-primary-foreground shadow-lg scale-110",
                      !isCompleted &&
                        !isCurrent &&
                        "border-border bg-background text-muted-foreground group-hover:border-primary"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </span>
                </span>
                <span className="mt-3 text-center">
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
                  <span className="mt-1 block text-xs text-muted-foreground max-w-[120px]">
                    {step.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
