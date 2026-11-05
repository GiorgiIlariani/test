# Wizard

`Wizard` is a navigation shell for a Stepperize flow. Each step renders ordinary React content, while the component owns the Previous, Next, and Complete actions.

## Basic usage

Define the steps once:

```tsx
import { defineStepper } from '@stepperize/react';

const projectFlow = defineStepper([
  { id: 'details', title: 'Details' },
  { id: 'client', title: 'Client' },
  { id: 'review', title: 'Review' },
]);
```

Render the active step and handle the final action:

```tsx
import { Wizard } from 'components';

function CreateProject() {
  return (
    <Wizard
      definition={projectFlow}
      onSubmit={async () => {
        await createProject();
        return true;
      }}
    >
      {(stepper) =>
        stepper.match({
          details: () => <ProjectDetails />,
          client: () => <ClientDetails />,
          review: () => <ProjectReview />,
        })
      }
    </Wizard>
  );
}
```

- Previous calls `stepper.prev()`.
- Next calls `stepper.next()` on every step except the last.
- Complete calls `onSubmit(stepper)` on the last step.
- Step components can render fields, text, a review, or any other React content. They do not need their own `<form>` elements.

Keep form state in the parent or in a context shared by the step components. `Wizard` does not prescribe React Hook Form, Zod, or any other state and validation library.

## Optional step validation

Pass `beforeNext` when the current step should be validated before moving forward. Return `false` to stay on the current step. Returning `true` or `undefined` allows navigation.

```tsx
<Wizard
  definition={projectFlow}
  beforeNext={(stepper) => {
    if (stepper.id === 'details') return detailsForm.trigger();
    if (stepper.id === 'client') return clientForm.trigger();

    return true;
  }}
  onSubmit={async () => {
    const isValid = await finalForm.trigger();

    if (!isValid) return false;

    await createProject(finalForm.getValues());
    return true;
  }}
>
  {(stepper) =>
    stepper.match({
      details: () => <ProjectDetails />,
      client: () => <ClientDetails />,
      review: () => <ProjectReview />,
    })
  }
</Wizard>
```

`beforeNext` runs before any forward navigation, including the Next button, an allowed step
indicator, keyboard navigation, and calls such as `stepper.next()` or `stepper.goTo(...)`. If
`stepperOptions.beforeStepChange` is provided, it runs first; returning `false` prevents the step
change without calling `beforeNext` or `beforeBack`. `beforeNext` does not run for backward navigation
or final submission. Validate the final step inside `onSubmit` when necessary.

A successful `beforeNext` validation marks the current step complete, while a `false` result clears
its completion. A successful `onSubmit` marks the final step complete. When submission finds errors
in another step, the callback should clear that specific step with
`stepper.setComplete(stepId, false)` before navigating to it. Step indicators use this explicit
completion state for their checkmarks instead of assuming that every previously visited step is
valid. If a completed step can become stale as soon as its data changes, clear it from the step
content as well; the form wrapper cannot infer arbitrary field changes.

By default, `Wizard` uses linear navigation. Users can return to previous steps or open the immediate
next step, but they cannot skip later steps. Clicking the next step indicator uses the same
`beforeNext` validation as the Next button. To allow free navigation, pass
`stepperOptions={{ linear: false }}`.

## Props

| Prop             | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `definition`     | The typed result of `defineStepper(...)`.                           |
| `children`       | Renders the active step and receives the Stepperize `stepper`.      |
| `onSubmit`       | Runs on the last step. Return `true` after a successful submission. |
| `beforeNext`     | Validates before any forward navigation. Return `false` to block.   |
| `beforeBack`     | Runs before any backward navigation. Return `false` to block.       |
| `orientation`    | `horizontal` (default) or `vertical`.                               |
| `stepperOptions` | Stepperize state and behavior options. See the notes below.         |
| `submitting`     | External loading state that disables navigation actions.            |
| `backLabel`      | Custom Previous button label.                                       |
| `nextLabel`      | Custom Next button label.                                           |
| `submitLabel`    | Custom Complete button label.                                       |
| `classNames`     | Class overrides for individual component slots.                     |

Standard `<div>` props such as `id`, `data-*`, and `aria-*` are forwarded to the component root.
Use `classNames.root` instead of a `className` prop. Available slots are `root`, `list`, `item`,
`trigger`, `indicator`, `title`, `separator`, `content`, and `actions`.

Most `stepperOptions` are forwarded directly to Stepperize. `linear` defaults to `true` when omitted,
and `beforeStepChange` is composed with the directional `beforeNext` and `beforeBack` callbacks.
