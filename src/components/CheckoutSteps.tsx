import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Cart' },
  { id: 2, name: 'Personal Info' },
  { id: 3, name: 'Payment' },
  { id: 4, name: 'Shipping' },
  { id: 5, name: 'Confirmation' }
];

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="hidden sm:flex justify-between items-center">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center ${
              step.id < currentStep 
                ? 'text-success-500' 
                : step.id === currentStep 
                  ? 'text-primary-600' 
                  : 'text-secondary-400'
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step.id < currentStep 
                ? 'border-success-500 bg-success-50' 
                : step.id === currentStep 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-secondary-300 bg-secondary-50'
            }`}>
              {step.id < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <span className="ml-2 text-sm font-medium">{step.name}</span>
            {step.id !== steps.length && (
              <div className={`w-12 h-0.5 mx-2 ${
                step.id < currentStep ? 'bg-success-500' : 'bg-secondary-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.id < currentStep 
                  ? 'border-success-500 bg-success-50' 
                  : step.id === currentStep 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-secondary-300 bg-secondary-50'
              }`}
            >
              {step.id < currentStep ? (
                <CheckCircle className="w-5 h-5 text-success-500" />
              ) : (
                <span className={`text-sm font-medium ${
                  step.id === currentStep ? 'text-primary-600' : 'text-secondary-400'
                }`}>{step.id}</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-primary-600">
            {steps.find(step => step.id === currentStep)?.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;