"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { STUDENT_FORM_STEPS } from "@/hooks/use-student-form";

// ─────────────────────────────────────────────
// Form Stepper UI
// ─────────────────────────────────────────────

type Steps = typeof STUDENT_FORM_STEPS;

interface StudentFormStepperProps {
  steps: Steps;
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StudentFormStepper({
  steps,
  currentStep,
  onStepClick,
}: StudentFormStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden md:flex items-center">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "flex flex-col items-center gap-1.5 group",
                  step.id > currentStep
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                {/* Label */}
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </button>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 mx-2 h-0.5 rounded-full bg-border overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-primary transition-all duration-300",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: compact step indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">
            Step {currentStep} of {steps.length}:{" "}
            {steps[currentStep - 1]?.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                step.id < currentStep
                  ? "bg-primary"
                  : step.id === currentStep
                  ? "bg-primary ring-2 ring-primary/30"
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
