import type { Editor as TinyMCEEditor } from 'tinymce';

export const ON_PASTE_MULTILINE_SEPARATOR_REGEX =
  /<p style="margin: 0px 0px 15px; padding: 0px; text-align: justify;"><\/p><p style="margin: 0px 0px 15px; padding: 0px; text-align: justify;"><\/p>/gm;

const openLink = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const attachEventListenersToLink = (editor: TinyMCEEditor) => {
  Array.from(editor.getDoc().querySelectorAll('a')).map((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const href = el.getAttribute('href');
      openLink(href!);
    });
  });
};

export const changePlaceholder = (text: string, editor: TinyMCEEditor) => {
  editor.getBody().setAttribute('data-mce-placeholder', text);
};
