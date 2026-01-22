# Vigil Onboarding (Multi-Step) — Agent Guide

## Purpose
The VIGIL onboarding flow collects caregiver profile data and submits a single payload to the onboarding API. The flow is fully driven by a configuration file and rendered by a shared multi-step component.

## Primary entry points
- Route: [app/vigil/onboard-v2/page.tsx](app/vigil/onboard-v2/page.tsx)
- Wrapper: [components/onboarding/vigil/VigilMultiStepOnboarding.tsx](components/onboarding/vigil/VigilMultiStepOnboarding.tsx)
- Flow config: [components/onboarding/multiStep/vigilOnboardingConfig.ts](components/onboarding/multiStep/vigilOnboardingConfig.ts)
- Orchestrator: [components/onboarding/multiStep/MultiStepOnboarding.tsx](components/onboarding/multiStep/MultiStepOnboarding.tsx)
- Types: [src/types/multiStepOnboard.types.ts](src/types/multiStepOnboard.types.ts)
- API integration: [src/services/onboard.service.ts](src/services/onboard.service.ts)

## How the flow works
- `MultiStepOnboarding` controls navigation and validation per step using `react-hook-form`.
- Steps come from `createVigilOnboardingConfig()`.
- Every answer is collected in a flat `Record<string, any>` and passed to `onComplete` in the wrapper.
- `onComplete` maps fields to the payload used by `OnboardService.update()`.
- **Question `id` must match the Supabase column name** where the value is stored.

## Current step sequence (from config)
Source of truth: [components/onboarding/multiStep/vigilOnboardingConfig.ts](components/onboarding/multiStep/vigilOnboardingConfig.ts)

1. `welcome`
   - `birthday` (date, required, 18–80 years)
   - `gender` (select)
2. `address`
   - `address` (address search, required)
3. `zones`
   - `zones` (multi-checkbox, required)
4. `transportation`
   - `transportation` (radio, required)
5. `occupation`
   - `occupation` (radio, required)
   - Conditional: if `OccupationEnum.PROFESSIONAL`, go to `professional-docs-info`, else `courses`
6. `professional-docs-info`
   - `understandsDocRequirement` (checkbox, required)
7. `courses`
   - `courses` (textarea, optional, max 650)
8. `years_of_experience`
   - `experience_years` (radio, required)
9. `about`
   - `bio` (textarea, required, max 400)
10. `daily_activities`
    - `services` (multi-checkbox, required)
11. `hygene`
    - `hygene_services` (multi-checkbox, required, includes `none`)
12. `outside`
    - `outdoor_services` (multi-checkbox, required, includes `none`)
13. `past_exp`
    - `past_experience` (multi-checkbox, required)
14. `service_type`
    - `type` (multi-checkbox, required)
15. `hours`
    - `time-committment` (radio, required)
16. `availabilities`
    - `availabilities` (custom availability input, optional)
17. `urgent`
    - `urgent_requests` (radio)
18. `character`
    - `char` (multi-checkbox, required, max 3)
19. `languages`
    - `char` (select-multi, required)
20. `propic`
    - `photo` (file, required)

## ID contract
Each question `id` must match the Supabase column name that will store the answer.

## Data submission mapping (wrapper)
`VigilMultiStepOnboarding` transforms answers before sending them to `OnboardService.update()`:
- Sent fields (current): `birthday`, `phone`, `occupation`, `information`, `transportation`, `addresses`, `cap`, `understandsDocRequirement`, `wideAreaCoverage`
- Address handling: it extracts `postcode` or `postalCode` into `cap` and wraps the address into `addresses`.

⚠️ **Potential mismatches** to keep in mind when editing:
- The config does not currently collect `phone`, `information`, or `wideAreaCoverage`.
- The config collects many fields that are not sent (`gender`, `zones`, `courses`, `experience_years`, `bio`, `services`, `hygene_services`, `outdoor_services`, `past_experience`, `type`, `time-committment`, `availabilities`, `urgent_requests`, `char`, `photo`).
- The `languages` step uses `id: "char"`, which collides with the `character` step answer key.
- The `hygene` step checks `answers.services` for `none`, but the `none` option exists in `hygene_services`.
- The `outside` step checks `answers.outside`, but the question id is `outdoor_services`.

## Question types reference
See [​.github/features/onboarding/vigil/question-types.md](.github/features/onboarding/vigil/question-types.md) for supported `QuestionType` values and rendering notes.

If you change any question IDs or add/remove steps, update the mapping in [components/onboarding/vigil/VigilMultiStepOnboarding.tsx](components/onboarding/vigil/VigilMultiStepOnboarding.tsx).

## Conditional logic
- `occupation` routes to `professional-docs-info` when `OccupationEnum.PROFESSIONAL` is selected.
- All other steps follow a linear flow.

## UI components used by question types
Rendering is handled by `QuestionRenderer` in [components/onboarding/multiStep/QuestionRenderer.tsx](components/onboarding/multiStep/QuestionRenderer.tsx). Ensure the question type you add is supported there.

## Known documentation drift
The flow diagrams and summary were created earlier and do not reflect the current step list:
- [components/onboarding/multiStep/FLOW_DIAGRAMS.md](components/onboarding/multiStep/FLOW_DIAGRAMS.md)
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

Use the config file as the single source of truth.

## Agent checklist when modifying the vigil flow
1. Update step order and question IDs in `createVigilOnboardingConfig()`.
2. Align `onComplete` mapping with the new answers.
3. If you add new question types, verify `QuestionRenderer` supports them.
4. Validate submission by checking `OnboardService.update()` payload.
5. Confirm routing stays under `/vigil/onboard-v2` and redirects in [app/vigil/onboard-v2/page.tsx](app/vigil/onboard-v2/page.tsx) still apply.
