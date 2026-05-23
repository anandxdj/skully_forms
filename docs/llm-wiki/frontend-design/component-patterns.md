---
title: UI Component Patterns
version: 1.0.0
scope: frontend-design
last_updated: 2026-05-22
owner: frontend-team
tags: [components, forms, validation, layout]
chunk_id: ui-component-patterns
---

# UI Component Patterns

## Covers
- Component engineering layout guidelines and modularity rules
- Input forms management via Zod and `react-hook-form`
- Interactivity standards (toast alerts, Radix dialogs)

## Excludes
- DB schemas or migration scripts
- Direct API server hook implementations

## ✍️ Form Validations & Integrations
We use `react-hook-form` combined with `@hookform/resolvers/zod` to build type-safe input form components:

### Forms Architecture
- **Schema Mapping**: Define form inputs as a Zod schema in the component or shared feature space.
- **Hook Instance**: Initialize the form using:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<FormInputType>({
  resolver: zodResolver(formValidationSchema),
  defaultValues: { ... }
});
```
- **Error Control**: Error signals are derived automatically from the Zod schema and displayed in real-time beneath matching inputs.
<!-- chunk-end -->

## 🧩 Reusable UX Interactivity
For interactive alerts, modals, and user notifications, we leverage Shadcn primitives:

### Shared UI Libraries
- **Dialogs & Modals**: Implemented using `@radix-ui/react-dialog` for fully accessible popup focus boundaries.
- **Alert Toast System**: Powered by `sonner`. Call `toast.success("Message")` or `toast.error("Message")` for clean notifications.
- **Loading Spinners**: For loading states, display custom micro-animations (e.g. keyframe-pulsing spinners) to maximize visual quality.
<!-- chunk-end -->

## ⚠️ Component Invariants & Rules

### Constraints
- **Accessibility Invariants**: All interactive components must declare standard ARIA attributes and enable full keyboard traversal.
- **LLM UI Rules**:
  ⚠️ LLM NOTE: Always utilize the standard `sonner` toast trigger instead of constructing custom alert banners or alert boxes, unless asked otherwise. Always type forms strictly using inferred Zod shapes.
<!-- chunk-end -->
