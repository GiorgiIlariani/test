import { useLayoutEffect, useRef, useState } from 'react';
import { matchingVariables } from './helpers';

/** Finds the @ variable currently being typed. */
const findMentionAtCursor = (value: string, cursor: number) =>
  value.slice(0, cursor).match(/@([A-Za-z]*)$/);

export const useInvoiceEmailVariableSuggestions = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const highlightsOverlayRef = useRef<HTMLDivElement | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const pendingSelection = useRef<{ value: string; cursor: number }>();

  // Wait until the new value appears, then place the cursor after the inserted variable.
  useLayoutEffect(() => {
    const input = inputRef.current;
    const selection = pendingSelection.current;
    if (input && selection && input.value === selection.value) {
      pendingSelection.current = undefined;
      input.focus();
      input.setSelectionRange(selection.cursor, selection.cursor);
    }
  });

  /** Hides the suggestion list. */
  const dismissSuggestions = () => setSuggestions([]);

  /** Updates the suggestions to match the @ variable currently being typed. */
  const updateSuggestions = (value: string, cursor: number) => {
    const mention = findMentionAtCursor(value, cursor);
    setSuggestions(mention ? matchingVariables(mention[1]) : []);
  };

  /** Replaces the typed @ text with the selected variable and moves the cursor after it. */
  const insertVariable = (variable: string, onChange: (value: string) => void) => {
    const input = inputRef.current;
    if (!input) return;

    const cursor = input.selectionStart ?? input.value.length;
    const mention = findMentionAtCursor(input.value, cursor);
    if (!mention) {
      dismissSuggestions();
      return;
    }

    const start = cursor - mention[0].length;
    const end = input.selectionEnd ?? cursor;
    const value = `${input.value.slice(0, start)}${variable}${input.value.slice(end)}`;
    pendingSelection.current = { value, cursor: start + variable.length };
    onChange(value);
    dismissSuggestions();
  };

  return {
    inputRef,
    highlightsOverlayRef,
    suggestions,
    dismissSuggestions,
    updateSuggestions,
    insertVariable,
  };
};
