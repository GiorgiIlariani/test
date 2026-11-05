import type { Editor } from 'tinymce';

export const INVOICE_EMAIL_VARIABLES = [
  '@ClientName',
  '@InvoiceMonth',
  '@InvoiceDate',
  '@ProjectName',
  '@InvoiceID',
] as const;

export const matchingVariables = (query: string) =>
  INVOICE_EMAIL_VARIABLES.filter((variable) =>
    variable.slice(1).toLowerCase().startsWith(query.toLowerCase()),
  );

export const invoiceVariablePattern = () => new RegExp(INVOICE_EMAIL_VARIABLES.join('|'), 'g');

// Make the variables clickable
const selectClickedEditorVariable = (editor: Editor) => {
  const currentRange = editor.selection.getRng();
  if (!currentRange.collapsed || currentRange.startContainer.nodeType !== Node.TEXT_NODE) return;

  const textNode = currentRange.startContainer;
  const offset = currentRange.startOffset;
  const match = [...(textNode.textContent ?? '').matchAll(invoiceVariablePattern())].find(
    ({ index, 0: variable }) =>
      index !== undefined && offset >= index && offset <= index + variable.length,
  );
  if (!match) return;

  const range = editor.getDoc().createRange();
  range.setStart(textNode, match.index!);
  range.setEnd(textNode, match.index! + match[0].length);
  editor.selection.setRng(range);
};

// Highlight ranges without adding formatting to the saved or outgoing email HTML.
const highlightEditorVariables = (editor: Editor) => {
  const highlightName = 'invoice-email-variables';

  const refresh = () => {
    const win = editor.getWin() as Window & typeof globalThis;
    if (!win.CSS?.highlights || !win.Highlight) return;

    const document = editor.getDoc();
    const walker = document.createTreeWalker(editor.getBody(), NodeFilter.SHOW_TEXT);
    const ranges: Range[] = [];
    let node = walker.nextNode();

    while (node) {
      for (const match of (node.textContent ?? '').matchAll(invoiceVariablePattern())) {
        const range = document.createRange();
        range.setStart(node, match.index!);
        range.setEnd(node, match.index! + match[0].length);
        ranges.push(range);
      }
      node = walker.nextNode();
    }

    win.CSS.highlights.set(highlightName, new win.Highlight(...ranges));
  };

  editor.on('init', () => {
    editor.dom.addStyle(
      `::highlight(${highlightName}) { background-color: oklch(0.457 0.24 277.023 / 20%); }`,
    );
    refresh();
  });
  editor.on('SetContent input change Undo Redo', refresh);
  editor.on('click', () => selectClickedEditorVariable(editor));
  editor.on('remove', () => {
    const win = editor.getWin() as Window & typeof globalThis;
    win.CSS?.highlights?.delete(highlightName);
  });
};

export const addVariableAutocompleter = (editor: Editor) => {
  highlightEditorVariables(editor);

  editor.ui.registry.addAutocompleter('invoice-email-variables', {
    trigger: '@',
    minChars: 0,
    columns: 1,
    // Stop the current suggestion after punctuation or spaces so another @ can start a new one.
    matches: (_range, _text, pattern) => /^[A-Za-z]*$/.test(pattern),
    fetch: (pattern) =>
      Promise.resolve(
        matchingVariables(pattern).map((variable) => ({
          type: 'autocompleteitem',
          value: variable,
          text: variable,
        })),
      ),
    onAction: (autocompleteApi, range, value) => {
      editor.selection.setRng(range);
      editor.insertContent(value);
      autocompleteApi.hide();
    },
  });
};
