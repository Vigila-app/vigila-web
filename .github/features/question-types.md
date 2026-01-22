# Vigil Onboarding Question Types

Source of truth: [src/types/multiStepOnboard.types.ts](src/types/multiStepOnboard.types.ts)

## Supported `QuestionType` values
- `TEXT`
- `NUMBER`
- `DATE`
- `EMAIL`
- `PHONE`
- `TEXTAREA`
- `SELECT`
- `CHECKBOX`
- `RADIO`
- `ADDRESS`
- `MULTI_ADDRESS`
- `MULTI_CHECKBOX`
- `CARD`
- `FILE`
- `SELECT_MULTI`
- `AVAILABILITIES`

## Renderer mapping
`QuestionRenderer` in [components/onboarding/multiStep/QuestionRenderer.tsx](components/onboarding/multiStep/QuestionRenderer.tsx) maps types to components:
- `TEXT`, `EMAIL`, `PHONE` → `TextLikeInput`
- `NUMBER` → `NumericInput`
- `DATE` → `DateInput`
- `TEXTAREA` → `TextAreaInput`
- `SELECT` → `SelectInput`
- `RADIO` → `RadioInput`
- `CARD` → `CardInput`
- `CHECKBOX` → `CheckboxInput`
- `MULTI_CHECKBOX` → `MulticheckboxInput`
- `ADDRESS` → `AddressInput`
- `MULTI_ADDRESS` → `MultiAddressInput`
- `FILE` → `FileInput`
- `SELECT_MULTI` → `SelectMultiInput`
- `AVAILABILITIES` → `AvailabilitiesInput`

## Validation notes
Validation rules are defined per question via `validation` in the config.
- The `FILE` type supports `file.maxSize` and `file.allowedMimes`.
- `MULTI_CHECKBOX` supports `max` selection count.
