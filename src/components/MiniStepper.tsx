import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  name: string;
  path: string;
}

interface MiniStepperProps {
  steps: Step[];
  currentStep: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function MiniStepper({ steps, currentStep, onNext, onPrevious }: MiniStepperProps) {
  const currentStepData = steps.find(s => s.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="sticky top-0 z-50 bg-background/98 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={isFirstStep || !onPrevious}
          className="gap-2 shrink-0 hover:bg-primary/10 hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4 flex-1 max-w-3xl mx-auto">
          {/* Step Counter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {currentStep}
            </div>
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              de {steps.length}
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="flex-1 space-y-1">
            {/* Current Step Name */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {currentStepData?.name}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Steps Dots Indicator (visible on larger screens) */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step.id === currentStep
                    ? 'bg-primary w-6'
                    : step.id < currentStep
                    ? 'bg-accent'
                    : 'bg-muted'
                }`}
                title={step.name}
              />
            ))}
          </div>
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={isLastStep || !onNext}
          className="gap-2 shrink-0 hover:bg-primary/10 hover:text-primary"
        >
          <span className="hidden sm:inline">Próximo</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

