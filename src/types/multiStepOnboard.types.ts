import { RolesEnum } from "@/src/enums/roles.enums";
import {
  ComponentType,
  ForwardRefExoticComponent,
  ReactElement,
  SVGProps,
} from "react";
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
  FILE = "file",
  SELECT_MULTI = "select_multi",
  AVAILABILITIES = "availabilities",
}

/**
 * File validation rules for file upload questions
 */
export interface FileValidation {
  maxSize?: number; // in bytes
  allowedMimes?: string[]; // e.g., ['image/jpeg', 'image/png']
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
  file?: FileValidation;
}

/**
 * Option for select, radio, or checkbox questions
 */
export interface QuestionOption {
  label: string;
  value: string | number;
  icon?: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  description?: string;
  fee?: number;
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
  variation?: string;
  max?: number | string;
  min?: number | string;
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
  questions?: OnboardingQuestion[];
  /**
   * Optional custom component to render for this step. If provided, the
   * `MultiStepOnboarding` will render this component instead of the
   * default question rendering. The component will receive helpful props
   * such as `control`, `register`, `errors`, `role`, `step`, and `answers`.
   * Use `react-hook-form`'s `control` or `register` inside the component
   * for form integration, then let the parent handle submission validation
   * and navigation (or call the provided callbacks).
   */
  component?: any;
  note?: string;
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
  variation?: string;
  onChange: (value: any) => void;
  error?: FieldError;
  role: RolesEnum;
}
