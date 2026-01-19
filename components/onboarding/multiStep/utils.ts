import { QuestionType } from "@/src/types/multiStepOnboard.types";

  export const getInputType = (questionType: QuestionType): string => {
    switch (questionType) {
      case QuestionType.EMAIL:
        return "email";
      case QuestionType.PHONE:
        return "tel";
      default:
        return "text";
    }
  };