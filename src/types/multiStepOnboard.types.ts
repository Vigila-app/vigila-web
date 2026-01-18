import { RolesEnum } from "@/src/enums/roles.enums";
import { ForwardRefExoticComponent, SVGProps } from "react";
import { FieldError } from "react-hook-form";

/**
 * Question types supported in the multi-step onboarding
 */
export enum QuestionType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  EMAIL = "email",
  PHONE = "phone",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  ADDRESS = "address",
  MULTI_ADDRESS = "multi_address",
  MULTI_CHECKBOX = "multi_checkbox",
  CARD = "card",
}

/**
 * Validation rules for a question
 */
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
}

/**
 * Option for select, radio, or checkbox questions
 */
export interface QuestionOption {
  label: string;
  value: string | number;
  icon?: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref">>; //as for icon library
  description?: string;
}

/**
 * Represents a single question in the onboarding flow
 */
export interface OnboardingQuestion {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  description?: string;
  options?: QuestionOption[];
  validation?: ValidationRules;
  nextStep?:
    | string
    | ((answer: any, allAnswers: Record<string, any>) => string | null);
  autoFocus?: boolean;
}

/**
 * Represents a step in the onboarding flow
 */
export interface OnboardingStep {
  id: string;
  title?: string;
  description?: string;
  questions: OnboardingQuestion[];
  nextStep?: string | ((answers: Record<string, any>) => string | null);
}

/**
 * Configuration for the multi-step onboarding flow
 */
export interface OnboardingFlowConfig {
  role: RolesEnum;
  steps: OnboardingStep[];
  initialStepId: string;
  onComplete: (data: Record<string, any>) => Promise<void>;
}

/**
 * Current state of the onboarding flow
 */
export interface OnboardingFlowState {
  currentStepId: string;
  currentStepIndex: number;
  answers: Record<string, any>;
  visitedSteps: string[];
  isLoading: boolean;
  error?: string;
}

/**
 * Props for the MultiStepOnboarding component
 */
export interface MultiStepOnboardingProps {
  config: OnboardingFlowConfig;
  onCancel?: () => void;
}

/**
 * Props for the QuestionRenderer component
 */
export interface QuestionRendererProps {
  question: OnboardingQuestion;
  value: any;
  onChange: (value: any) => void;
  error?: FieldError;
  role: RolesEnum;
}
