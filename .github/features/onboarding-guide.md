# Onboarding Development Guide

> **Purpose**: Practical guide for developers and agents working with the multi-step onboarding system. Use this for implementation, customization, testing, and troubleshooting.

## Table of Contents
- [Quick Start](#quick-start)
- [Creating Custom Flows](#creating-custom-flows)
- [Adding/Modifying Steps](#addingmodifying-steps)
- [Custom Question Types](#custom-question-types)
- [Testing Guide](#testing-guide)
- [Migration Strategy](#migration-strategy)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Quick Start

### Using Existing Flows

#### Consumer Onboarding
```tsx
// app/(consumer)/onboard-v2/page.tsx
import ConsumerMultiStepOnboarding from "@/components/onboarding/consumer/ConsumerMultiStepOnboarding";

export default function ConsumerOnboardPage() {
  return <ConsumerMultiStepOnboarding />;
}
```

**Routes**:
- New flow: `/onboard-v2`
- Old flow: `/onboard` (still active)

---

#### Vigil Onboarding
```tsx
// app/vigil/onboard-v2/page.tsx
import VigilMultiStepOnboarding from "@/components/onboarding/vigil/VigilMultiStepOnboarding";

export default function VigilOnboardPage() {
  return <VigilMultiStepOnboarding />;
}
```

**Routes**:
- New flow: `/vigil/onboard-v2`
- Old flow: `/vigil/onboard` (still active)

---

## Creating Custom Flows

### Step 1: Define Your Steps

Create a new config file: `components/onboarding/multiStep/myCustomConfig.ts`

```typescript
import { OnboardingStep, QuestionType } from "@/src/types/multiStepOnboard.types";
import { RolesEnum } from "@/src/enums/roles.enum";

export const createMyCustomConfig = (
  onComplete: (data: Record<string, any>) => Promise<void>
) => {
  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome!",
      description: "Let's get started",
      questions: [
        {
          id: "name",
          type: QuestionType.TEXT,
          label: "What's your name?",
          validation: { required: true, maxLength: 100 },
          autoFocus: true
        }
      ],
      nextStep: "contact"
    },
    {
      id: "contact",
      title: "Contact Information",
      questions: [
        {
          id: "email",
          type: QuestionType.EMAIL,
          label: "Email address",
          validation: { required: true }
        },
        {
          id: "phone",
          type: QuestionType.PHONE,
          label: "Phone number",
          validation: { required: true }
        }
      ],
      nextStep: "role-selection"
    },
    {
      id: "role-selection",
      title: "Select Your Role",
      questions: [
        {
          id: "role",
          type: QuestionType.RADIO,
          label: "What describes you best?",
          options: [
            { label: "Individual", value: "individual" },
            { label: "Business", value: "business" }
          ],
          validation: { required: true },
          // Conditional routing based on selection
          nextStep: (answer) => {
            return answer === "business" ? "business-details" : "completion";
          }
        }
      ]
    },
    {
      id: "business-details",
      title: "Business Information",
      questions: [
        {
          id: "companyName",
          type: QuestionType.TEXT,
          label: "Company name",
          validation: { required: true }
        },
        {
          id: "vatNumber",
          type: QuestionType.TEXT,
          label: "VAT number",
          validation: { required: true, pattern: /^IT[0-9]{11}$/ }
        }
      ],
      nextStep: "completion"
    },
    {
      id: "completion",
      title: "Almost Done!",
      questions: [
        {
          id: "terms",
          type: QuestionType.CHECKBOX,
          label: "I agree to the terms and conditions",
          validation: { required: true }
        }
      ]
      // No nextStep = completion
    }
  ];

  return {
    role: RolesEnum.CONSUMER, // or custom role
    initialStepId: "welcome",
    steps,
    onComplete
  };
};
```

---

### Step 2: Create Wrapper Component

Create: `components/onboarding/myCustom/MyCustomOnboarding.tsx`

```typescript
"use client";

import { useRouter } from "next/navigation";
import MultiStepOnboarding from "@/components/onboarding/multiStep/MultiStepOnboarding";
import { createMyCustomConfig } from "@/components/onboarding/multiStep/myCustomConfig";
import { OnboardService } from "@/src/services/onboard.service";
import { AuthService } from "@/src/services/auth.service";
import { useUserStore } from "@/src/store/user.store";
import { useAppStore } from "@/src/store/app.store";
import { RolesEnum } from "@/src/enums/roles.enum";

export default function MyCustomOnboarding() {
  const router = useRouter();
  const { getUserDetails } = useUserStore();
  const { showToast } = useAppStore();

  const handleComplete = async (answers: Record<string, any>) => {
    try {
      // Transform answers to API payload
      const payload = {
        name: answers.name,
        email: answers.email,
        phone: answers.phone,
        role: answers.role,
        // Conditional fields
        ...(answers.role === "business" && {
          companyName: answers.companyName,
          vatNumber: answers.vatNumber
        }),
        termsAccepted: answers.terms
      };

      // Submit to API
      await OnboardService.update({
        role: RolesEnum.CONSUMER,
        data: payload
      });

      // Refresh authentication
      await AuthService.renewAuthentication();
      
      // Update user store
      await getUserDetails();

      // Show success message
      showToast({
        message: "Onboarding completed successfully!",
        type: "success"
      });

      // Navigate to home
      router.push("/home");
    } catch (error) {
      console.error("Onboarding error:", error);
      showToast({
        message: "Failed to complete onboarding. Please try again.",
        type: "error"
      });
      throw error;
    }
  };

  const config = createMyCustomConfig(handleComplete);

  return <MultiStepOnboarding config={config} />;
}
```

---

### Step 3: Create Page

Create: `app/my-onboard/page.tsx`

```tsx
import MyCustomOnboarding from "@/components/onboarding/myCustom/MyCustomOnboarding";

export default function MyOnboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <MyCustomOnboarding />
    </div>
  );
}
```

---

## Adding/Modifying Steps

### Adding a New Step

1. **Add to config file** (e.g., `consumerOnboardingConfig.ts`):

```typescript
const steps: OnboardingStep[] = [
  // ... existing steps
  {
    id: "new-step",
    title: "New Step Title",
    description: "Optional description",
    questions: [
      {
        id: "newField",
        type: QuestionType.TEXT,
        label: "Label text",
        validation: { required: true }
      }
    ],
    nextStep: "next-step-id" // or function for conditional
  }
];
```

2. **Update routing** of previous step to point to new step:

```typescript
{
  id: "previous-step",
  // ... questions
  nextStep: "new-step" // Update this
}
```

3. **Update data mapping** in wrapper component:

```typescript
const handleComplete = async (answers: Record<string, any>) => {
  const payload = {
    // ... existing fields
    newField: answers.newField // Add new field
  };
  // ...
};
```

4. **Ensure database column exists** with matching name (`newField` in this case).

---

### Removing a Step

1. **Remove step definition** from config
2. **Update routing** of previous step to skip removed step
3. **Remove field mapping** from wrapper component
4. **Keep database column** (for backwards compatibility)

---

### Modifying Step Order

1. **Reorder in config** (doesn't affect anything else)
2. **Update nextStep references** to maintain correct flow
3. **No changes needed** in wrapper or database

---

## Custom Question Types

### Extending Question Types

To add a new question type:

#### 1. Add to QuestionType Enum

```typescript
// src/types/multiStepOnboard.types.ts
export enum QuestionType {
  // ... existing types
  CUSTOM_TYPE = "CUSTOM_TYPE"
}
```

#### 2. Create Custom Input Component

```tsx
// components/form/CustomInput.tsx
interface CustomInputProps {
  value: any;
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
  // ... other props
}

export const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  error,
  placeholder
}) => {
  return (
    <div className="w-full">
      {/* Your custom input UI */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

#### 3. Add to QuestionRenderer

```typescript
// components/onboarding/multiStep/QuestionRenderer.tsx
import { CustomInput } from "@/components/form/CustomInput";

// In QuestionRenderer component:
switch (question.type) {
  // ... existing cases
  
  case QuestionType.CUSTOM_TYPE:
    return (
      <Controller
        name={question.id}
        control={control}
        rules={getValidationRules(question.validation)}
        render={({ field, fieldState }) => (
          <CustomInput
            value={field.value}
            onChange={field.onChange}
            placeholder={question.placeholder}
            error={fieldState.error?.message}
          />
        )}
      />
    );
}
```

#### 4. Use in Config

```typescript
{
  id: "customField",
  type: QuestionType.CUSTOM_TYPE,
  label: "Custom Field",
  placeholder: "Enter value",
  validation: { required: true }
}
```

---

## Testing Guide

### Manual Testing Checklist

#### Consumer Flow
- [ ] Navigate to `/onboard-v2`
- [ ] Complete step 1 (welcome) with valid name
- [ ] Complete step 2 (age-info) with age and birthday
- [ ] Complete step 3 (contact-info) with phone
- [ ] Step 4 (relationship):
  - [ ] Test with "Figlio/a" → should skip to address
  - [ ] Test with "Badante" → should show professional-details
- [ ] Complete professional-details (if shown) with years
- [ ] Complete address with valid address
- [ ] Complete additional-info with text
- [ ] Verify submission succeeds
- [ ] Verify redirect to home
- [ ] Check database for saved data

#### Vigil Flow
- [ ] Navigate to `/vigil/onboard-v2`
- [ ] Complete step 1 (welcome) with birthday
- [ ] Complete step 2 (contact) with phone
- [ ] Step 3 (occupation):
  - [ ] Test with "OSA" → should show professional-docs-info
  - [ ] Test with "Altra" → should skip to experience
- [ ] Complete professional-docs-info (if shown)
- [ ] Complete experience with text
- [ ] Step 6 (transportation):
  - [ ] Test with "Auto" → should show service-area-wide
  - [ ] Test with "Bicicletta" → should show service-area-local
- [ ] Complete service-area step
- [ ] Complete address
- [ ] Verify submission succeeds
- [ ] Verify redirect to home
- [ ] Check database for saved data

---

### Validation Testing

Test each validation rule:

#### Required Fields
```typescript
validation: { required: true }
```
- [ ] Try submitting empty field
- [ ] Verify error message appears
- [ ] Enter value and verify error clears

#### Length Constraints
```typescript
validation: { minLength: 3, maxLength: 100 }
```
- [ ] Try too short (< 3 chars)
- [ ] Try too long (> 100 chars)
- [ ] Verify error messages

#### Pattern Matching
```typescript
validation: { pattern: /^[0-9]{10}$/ }
```
- [ ] Try invalid format
- [ ] Try valid format
- [ ] Verify pattern validation

#### Custom Validation
```typescript
validation: {
  validate: (value) => value >= 18 || "Must be 18+"
}
```
- [ ] Try invalid value
- [ ] Try valid value
- [ ] Verify custom error message

---

### Edge Cases

#### Back Navigation
- [ ] Complete 3 steps
- [ ] Click back twice
- [ ] Verify returns to step 1
- [ ] Verify all answers preserved
- [ ] Click next to step 2
- [ ] Verify answers still there

#### Conditional Routing
- [ ] Complete conditional question with path A
- [ ] Complete flow
- [ ] Restart onboarding
- [ ] Complete conditional question with path B
- [ ] Verify different steps shown
- [ ] Complete flow

#### Long Text
- [ ] Enter 650 characters in textarea
- [ ] Verify accepted
- [ ] Try 651 characters
- [ ] Verify error shown

#### Special Characters
- [ ] Enter special chars in text fields
- [ ] Verify accepted or rejected per validation
- [ ] Submit and verify saved correctly

#### Network Errors
- [ ] Disconnect network
- [ ] Try to submit
- [ ] Verify error message shown
- [ ] Reconnect network
- [ ] Retry submission
- [ ] Verify succeeds

---

## Migration Strategy

### Current State (Phase 1: Parallel Running)
✅ **Completed**:
- New flow at `/onboard-v2` and `/vigil/onboard-v2`
- Old flow at `/onboard` and `/vigil/onboard`
- Both fully functional and independent

### Phase 2: Testing & Validation
**Objective**: Validate new flow before rollout

**Tasks**:
1. Manual testing (use checklist above)
2. User acceptance testing
3. Performance validation
4. Data consistency checks
5. Security review

**Success Criteria**:
- All test cases pass
- No data loss or corruption
- Performance equal or better than old flow
- No security vulnerabilities

---

### Phase 3: Gradual Rollout
**Objective**: Migrate users safely

**Option A: Feature Flag**
```typescript
// config/features.ts
export const useNewOnboarding = () => {
  // Check user flag, A/B test, or rollout percentage
  return Math.random() < 0.5; // 50% rollout
};

// In signup flow
const onboardingUrl = useNewOnboarding() 
  ? "/onboard-v2" 
  : "/onboard";
```

**Option B: Manual Toggle**
```typescript
// Allow users to opt-in via query param
const useNewFlow = searchParams.get("new") === "true";
const onboardingUrl = useNewFlow ? "/onboard-v2" : "/onboard";
```

**Monitoring**:
- Track completion rates (old vs new)
- Monitor API errors
- Collect user feedback
- Measure time-to-complete

---

### Phase 4: Full Migration
**Objective**: Make new flow default

**Tasks**:
1. Update signup to use `/onboard-v2` by default
2. Add redirects from old routes:
   ```typescript
   // app/(consumer)/onboard/page.tsx
   export default function OldOnboard() {
     redirect("/onboard-v2");
   }
   ```
3. Archive old components (don't delete yet)
4. Update documentation
5. Announce to users

---

### Phase 5: Cleanup
**Objective**: Remove old code (after 30-60 days)

**Tasks**:
1. Verify no users on old flow
2. Remove old components:
   - `components/onboarding/consumer/onboardComponent_Consumer.tsx`
   - `components/onboarding/vigil/onboardComponent_Vigil.tsx`
3. Remove old routes:
   - `app/(consumer)/onboard/`
   - `app/vigil/onboard/`
4. Update imports and references
5. Clean up unused dependencies

---

## Troubleshooting

### Issue: Step Not Advancing

**Symptoms**: Clicking "Avanti" does nothing

**Possible Causes**:
1. Validation failing
2. nextStep not defined
3. JavaScript error

**Solutions**:
```typescript
// Check console for errors
console.log("Current step:", currentStepId);
console.log("Validation errors:", errors);

// Ensure nextStep is defined
nextStep: "next-step-id" // or function

// Check validation rules
validation: { required: true } // Must be satisfied
```

---

### Issue: Data Not Saving

**Symptoms**: Submission succeeds but data missing in database

**Possible Causes**:
1. Field ID doesn't match database column
2. Transformation missing in wrapper
3. API payload incorrect

**Solutions**:
```typescript
// Verify question ID matches DB column
{
  id: "lovedOneName", // Must match DB column exactly
  // ...
}

// Check wrapper mapping
const payload = {
  lovedOneName: answers.lovedOneName, // Must match question ID
  // ...
};

// Log payload before sending
console.log("Submitting:", payload);
await OnboardService.update({ role, data: payload });
```

---

### Issue: Conditional Routing Not Working

**Symptoms**: Wrong step shown after conditional question

**Possible Causes**:
1. nextStep function returning wrong value
2. Question-level overriding step-level unexpectedly
3. Typo in step ID

**Solutions**:
```typescript
// Add logging to nextStep function
nextStep: (answer, allAnswers) => {
  console.log("Routing based on:", answer);
  if (answer === "targetValue") {
    console.log("Going to special-step");
    return "special-step";
  }
  console.log("Using default route");
  return null;
}

// Verify step IDs match exactly
{
  id: "special-step", // Must match exactly
  // ...
}
```

---

### Issue: Address Not Saving Correctly

**Symptoms**: Address object truncated or postal code missing

**Possible Causes**:
1. Address extraction logic failing
2. Address object structure unexpected
3. API not accepting address format

**Solutions**:
```typescript
// Log address object
console.log("Address object:", answers.address);

// Verify extraction
const cap = 
  answers.address?.address?.postcode ||
  answers.address?.address?.postalCode ||
  "";
console.log("Extracted CAP:", cap);

// Wrap in array if needed
addresses: [answers.address] // API expects array
```

---

### Issue: Back Button Not Working

**Symptoms**: Back button does nothing or goes to wrong step

**Possible Causes**:
1. visitedSteps not tracking correctly
2. Step not found in steps array

**Solutions**:
```typescript
// Log visitedSteps state
console.log("Visited steps:", visitedSteps);

// Ensure steps are in config
const step = steps.find(s => s.id === stepId);
if (!step) {
  console.error("Step not found:", stepId);
}
```

---

## Best Practices

### Configuration

✅ **DO**:
- Use descriptive step and question IDs
- Keep question IDs matching database columns
- Add validation to all required fields
- Use static nextStep when possible (simpler)
- Document conditional logic with comments

❌ **DON'T**:
- Change question IDs after data is in database
- Use complex nested conditionals
- Hardcode values in questions
- Skip validation for "optional" fields that might be required

---

### Code Organization

✅ **DO**:
```typescript
// Separate config creation from component
export const createConfig = (onComplete) => { ... };

// Keep wrapper focused on integration
export default function Wrapper() {
  const handleComplete = async (answers) => { ... };
  return <MultiStepOnboarding config={createConfig(handleComplete)} />;
}

// Extract complex transformations
const transformAnswersToPayload = (answers) => { ... };
```

❌ **DON'T**:
```typescript
// Don't inline everything
export default function Component() {
  const config = {
    steps: [ /* massive inline config */ ]
  };
  return <MultiStepOnboarding config={config} />;
}
```

---

### Error Handling

✅ **DO**:
```typescript
try {
  await OnboardService.update({ role, data });
  showToast({ message: "Success!", type: "success" });
  router.push("/home");
} catch (error) {
  console.error("Onboarding error:", error);
  showToast({
    message: "Failed. Please try again.",
    type: "error"
  });
  // Don't navigate on error
}
```

❌ **DON'T**:
```typescript
// Don't swallow errors
await OnboardService.update({ role, data }).catch(() => {});

// Don't navigate on error
router.push("/home");
```

---

### Validation

✅ **DO**:
```typescript
// Specific validation with clear errors
validation: {
  required: true,
  minLength: 3,
  maxLength: 100,
  pattern: /^[A-Za-z\s]+$/,
  validate: (value) => {
    if (!value.includes(" ")) {
      return "Please enter full name";
    }
    return true;
  }
}
```

❌ **DON'T**:
```typescript
// Vague or missing validation
validation: {
  required: true // Too generic
}
```

---

### Performance

✅ **DO**:
- Keep config creation outside render
- Memoize expensive computations
- Use dynamic imports for large components
- Lazy load address search results

❌ **DON'T**:
- Recreate config on every render
- Load all options upfront
- Fetch data on every step change

---

## Quick Reference

### File Locations
- **Configs**: `components/onboarding/multiStep/*Config.ts`
- **Wrappers**: `components/onboarding/{consumer|vigil}/*Onboarding.tsx`
- **Core**: `components/onboarding/multiStep/MultiStepOnboarding.tsx`
- **Types**: `src/types/multiStepOnboard.types.ts`
- **Pages**: `app/(consumer)/onboard-v2/page.tsx`, `app/vigil/onboard-v2/page.tsx`

### Key Functions
- `createConsumerOnboardingConfig()`: Consumer flow
- `createVigilOnboardingConfig()`: Vigil flow
- `OnboardService.update()`: Submit data
- `AuthService.renewAuthentication()`: Refresh session
- `useUserStore.getUserDetails()`: Update user state


---

For technical reference, see [onboarding-system-reference.md](./onboarding-system-reference.md).  
For consumer flow, see [onboarding-consumer-flow.md](./onboarding-consumer-flow.md).  
For vigil flow, see [onboarding-vigil-flow.md](./onboarding-vigil-flow.md).
