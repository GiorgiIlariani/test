import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { cn } from 'lib';

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />;
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return <CollapsiblePrimitive.Trigger data-slot='collapsible-trigger' {...props} />;
}

function CollapsibleContent({ className, ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot='collapsible-content'
      className={cn(
        'overflow-hidden data-closed:animate-collapsible-up data-starting-style:animate-collapsible-down data-open:animate-collapsible-down data-ending-style:animate-collapsible-up [--radix-collapsible-content-height:var(--collapsible-panel-height)]',
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
