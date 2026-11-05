'use client';

import { storeFieldInCookieObject } from 'helpers';
import { useElementIsOnScreen } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { Editor } from 'tinymce';
import { attachEventListenersToLink, changePlaceholder } from './helpers';
import { Props } from './types';

export const useTinyMCE = (
  inputName: string,
  externalOnChangeHandler: Props['externalOnChangeHandler'],
  needsDraft: Props['needsDraft'],
  placeholder: Props['placeholder'],
  registerOptions: Props['registerOptions'],
) => {
  const {
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const labelRef = useRef<HTMLLabelElement>(null);
  const [appearedOnce, setAppearedOnce] = useState(true);
  const isEditorVisible = useElementIsOnScreen(labelRef, appearedOnce);
  const value = useWatch({
    name: inputName,
  });
  const [editorIsMounted, setEditorIsMounted] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const borderOverlayRef = useRef<HTMLDivElement>(null);
  const topOverlayRef = useRef<HTMLDivElement>(null);
  const bottomOverlayRef = useRef<HTMLDivElement>(null);
  const firstMount = useRef(true);
  const [overflowedWrapper, setOverflowedWrapper] = useState<HTMLElement>();
  const [isEditorLoading, setIsEditorLoading] = useState(true);

  useEffect(() => {
    const wrapper = document.getElementById('layout-content');
    if (wrapper) setOverflowedWrapper(wrapper);
  }, []);

  useEffect(() => {
    register(inputName, registerOptions);
  }, [register, inputName, registerOptions]);

  const togglerOverlay = (hide: boolean) => {
    const borderOverlay = borderOverlayRef.current;
    const topOverlay = topOverlayRef.current;
    const bottomOverlay = bottomOverlayRef.current;

    if (borderOverlay && topOverlay && bottomOverlay && editorRef.current) {
      if (hide) {
        changePlaceholder(' ', editorRef.current);
        editorRef.current.getBody().setAttribute('data-mce-placeholder', ' ');
        borderOverlay.classList.add('hidden');
        topOverlay.classList.add('hidden');
        bottomOverlay.classList.add('hidden');
      } else {
        if (!getValues(inputName)) {
          changePlaceholder(placeholder ?? ' ', editorRef.current);
        }
        borderOverlay.classList.remove('hidden');
        topOverlay.classList.remove('hidden');
        bottomOverlay.classList.remove('hidden');
      }
    }
  };

  useEffect(() => {
    if (isEditorVisible) {
      setAppearedOnce(true);
    }
  }, [isEditorVisible]);

  const focusHandler = () => {
    if (firstMount.current) {
      if (editorRef.current) {
        editorRef.current.iframeElement?.blur();
      }
      return;
    }
    togglerOverlay(true);
  };

  const blurHandler = () => {
    if (!firstMount.current) {
      togglerOverlay(false);
    }
    firstMount.current = false;
  };

  const editorOnChangeHandler = (content: string) => {
    setValue(inputName, content, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    const editor = editorRef.current;
    if (editor) {
      changePlaceholder(' ', editor);
      editor.getBody().setAttribute('data-mce-placeholder', ' ');
      attachEventListenersToLink(editor);
    }
    externalOnChangeHandler && externalOnChangeHandler();
    if (needsDraft) {
      storeFieldInCookieObject(inputName, content, 'add-employee');
    }
  };

  const editorEventListeners = (editor: Editor) => {
    editor.on('init', () => {
      attachEventListenersToLink(editor);
    });

    editor.on('focus', () => {
      if (!overflowedWrapper) return;

      localStorage.setItem('mce-scroll', overflowedWrapper.scrollTop.toString());
    });

    editor.on('change', () => {
      const scrollPosition = localStorage.getItem('mce-scroll');
      if (!overflowedWrapper || !scrollPosition) return;

      overflowedWrapper.scrollTo(0, Number(scrollPosition));
    });
  };

  return {
    focusHandler,
    blurHandler,
    labelRef,
    isEditorVisible,
    appearedOnce,
    editorRef,
    borderOverlayRef,
    topOverlayRef,
    bottomOverlayRef,
    setEditorIsMounted,
    editorIsMounted,
    editorOnChangeHandler,
    getValues,
    value,
    errors,
    editorEventListeners,
    isEditorLoading,
    setIsEditorLoading,
  };
};
