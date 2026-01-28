# Landing Page Components

This directory contains modular, reusable components for building landing pages. All components are built with Tailwind CSS using the project's brand colors and accept customizable props.

## Components

### LandingHero
Hero section with title, subtitle, description, CTA buttons, and optional image.

```tsx
<LandingHero
  title="L'assistenza del tuo quartiere a portata di click"
  subtitle="Un ponte tra generazioni"
  description="Con Vigila trovi in pochi secondi un Vigil di fiducia..."
  primaryButtonText="Inizia Ora"
  primaryButtonHref="/signup"
  secondaryButtonText="Scopri di Più"
  secondaryButtonHref="#features"
  imageSrc="/assets/home_banner.png"
  imageAlt="Vigila"
  bgColor="bg-gray-50"
/>
```

### LandingFeatures
Grid of features with icons, titles, and descriptions.

```tsx
<LandingFeatures
  sectionTitle="Perché Scegliere Vigila"
  sectionSubtitle="La nostra missione..."
  features={[
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Assistenza di Qualità",
      description: "Vigil qualificati e verificati..."
    },
    // ... more features
  ]}
  bgColor="bg-white"
/>
```

### LandingHowItWorks
Step-by-step process section with numbered cards.

```tsx
<LandingHowItWorks
  sectionTitle="Come Funziona"
  sectionSubtitle="Inizia il tuo viaggio..."
  steps={[
    {
      stepNumber: 1,
      title: "Crea il Tuo Account",
      description: "Registrati in pochi secondi...",
      icon: <UserIcon /> // optional
    },
    // ... more steps
  ]}
  bgColor="bg-gray-50"
/>
```

### LandingStats
Display statistics and metrics.

```tsx
<LandingStats
  sectionTitle="Vigila in Numeri"
  sectionSubtitle="La fiducia della nostra community..."
  stats={[
    { value: "5000", suffix: "+", label: "Famiglie Servite" },
    { value: "4.8", suffix: "/5", label: "Rating Medio" },
    // ... more stats
  ]}
  bgColor="bg-consumer-light-blue"
/>
```

### LandingTestimonials
User testimonials with ratings and author information.

```tsx
<LandingTestimonials
  sectionTitle="Cosa Dicono di Noi"
  sectionSubtitle="Le storie della nostra community..."
  testimonials={[
    {
      name: "Maria Rossi",
      role: "Madre di famiglia",
      content: "Vigila ha cambiato la mia vita!...",
      avatar: "MR",
      rating: 5
    },
    // ... more testimonials
  ]}
  bgColor="bg-white"
/>
```

### LandingCTA
Final call-to-action section.

```tsx
<LandingCTA
  title="Pronto a Iniziare?"
  subtitle="Unisciti a migliaia di famiglie..."
  buttonText="Registrati Gratis"
  buttonHref="/signup"
  secondaryButtonText="Diventa un Vigil"
  secondaryButtonHref="/vigil/signup"
  bgColor="bg-consumer-blue"
/>
```

## Styling

All components use:
- **Tailwind CSS** for styling
- **Brand colors**: `vigil-orange`, `consumer-blue`, `primary-*`, `secondary-*`
- **Responsive design**: Mobile-first with `md:` and `lg:` breakpoints
- **Minimal custom CSS**: Following project standards

## Usage

Import components individually or use the barrel export:

```tsx
import {
  LandingHero,
  LandingFeatures,
  LandingHowItWorks,
  LandingStats,
  LandingTestimonials,
  LandingCTA
} from "@/components/landing";
```

## Example

See `/app/(wall)/landing/page.tsx` for a complete example of all components in use.

## Customization

All components accept:
- Custom background colors via `bgColor` prop
- Custom CSS classes via `className` prop
- Content arrays for dynamic data
- Optional props for flexibility

Each component is designed to be:
- **Modular**: Can be used independently
- **Composable**: Easy to mix and match
- **Reusable**: Suitable for multiple landing pages
- **Customizable**: All text and styling via props
