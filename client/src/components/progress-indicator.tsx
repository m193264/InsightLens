interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center items-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep >= step.id 
                  ? "bg-primary text-white" 
                  : "bg-neutral-300 text-neutral-600"
              }`}
            >
              {step.id}
            </div>
            <div className="hidden sm:block">
              <span 
                className={`font-medium transition-colors ${
                  currentStep >= step.id 
                    ? "text-neutral-900" 
                    : "text-neutral-600"
                }`}
              >
                {step.title}
              </span>
              <p className="text-sm text-neutral-500">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div 
              className={`w-8 h-0.5 mx-4 transition-colors ${
                currentStep > step.id 
                  ? "bg-primary" 
                  : "bg-neutral-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
