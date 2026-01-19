# Vigila Multi-Step Onboarding: Agent & LLM Reference

## System Overview
- **Flexible, tree-based onboarding flow** for both CONSUMER and VIGIL users.
- Each step contains one or more questions; next step can be static or conditional (function of answers).
- All answers are collected and submitted in a single API call at completion.

## Core Components
- **MultiStepOnboarding.tsx**: Orchestrates flow, navigation, validation, and answer collection.
- **QuestionRenderer.tsx**: Renders questions by type (text, number, date, email, phone, textarea, select, radio, checkbox, multi-checkbox, address, file, select-multi).
- **Config files**: `consumerOnboardingConfig.ts`, `vigilOnboardingConfig.ts` define step/question trees for each role.

## Supported Question Types
- `TEXT`, `NUMBER`, `DATE`, `EMAIL`, `PHONE`, `TEXTAREA`, `SELECT`, `SELECT_MULTI`, `RADIO`, `CHECKBOX`, `MULTI_CHECKBOX`, `ADDRESS`, `FILE`, `AVAILABILITIES`

### Special Types
- **FILE**: File upload with validation (default: 5MB, JPG/PNG, customizable). Shows file name, remove button, error messages, and image preview in a circle if image.
- **SELECT_MULTI**: Multi-select dropdown with search, icon support, selected items display, and individual remove buttons.
- **AVAILABILITIES**: Weekly schedule with toggles and time ranges per day.

## Type System (src/types/multiStepOnboard.types.ts)
- `QuestionType`: Enum of all types above.
- `OnboardingQuestion`: { id, type, label, options, validation, ... }
- `OnboardingStep`: { id, title, description, questions, nextStep }
- `OnboardingFlowConfig`: { role, initialStepId, steps, onComplete }
- `ValidationRules`: { required, min, max, file?: { maxSize, allowedMimes } }

## UI/UX Patterns
- **Role-based theming**: Vigil = orange, Consumer = blue.
- **Error handling**: All inputs show error messages below, with icons.
- **File/image preview**: FILE type shows circular preview if image.
- **Multi-select**: SELECT_MULTI and MULTI_CHECKBOX support icons, max selection, and search (where relevant).

## Example Config (VIGIL, FILE & SELECT_MULTI)
```typescript
{
  id: "propic",
  type: QuestionType.FILE,
  label: "Upload Profile Picture",
  placeholder: "Max 5MB - JPG or PNG only",
  validation: {
    required: true,
    file: { maxSize: 5 * 1024 * 1024, allowedMimes: ["image/jpeg", "image/png"] }
  }
},
{
  id: "languages",
  type: QuestionType.SELECT_MULTI,
  label: "Lingue parlate",
  options: [
    { label: "Italiano", value: "italian", icon: ItalianFlagIcon },
    { label: "Inglese", value: "english", icon: EnglishFlagIcon },
    // ...
  ]
}
```

## Flow Diagrams
- See FLOW_DIAGRAMS.md for ASCII diagrams of both CONSUMER and VIGIL flows.

## Implementation Notes
- All question types are extensible; add new types in `QuestionType` enum and handle in `QuestionRenderer`.
- Validation is per-question and can be customized in config.
- For file/image preview, use `URL.createObjectURL` and clean up on unmount.
- For multi-select, always support icons and search for best UX.

---
This doc is optimized for future agent/LLM use: reference here for onboarding structure, question types, config, and UI/validation patterns. See config files for live examples.