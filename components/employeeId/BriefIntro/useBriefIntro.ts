'use client';

import { analytics } from 'helpers';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShowPageEmployee } from 'types';

export const useBriefIntro = (employee: ShowPageEmployee, sectionName: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(employee.brief_intro);
  const [itemIsCopied, setItemIsCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    defaultValues: {
      brief_intro: employee.brief_intro,
    },
  });

  const toggleModal = () => {
    analytics.track(`Profile Section Edit - ${sectionName}`);
    form.setValue('brief_intro', employee.brief_intro);
    form.clearErrors();
    setIsModalOpen((prev) => !prev);
  };

  const handleLists = value?.replace(/<ul>/g, '<ul style="list-style-type: disc;">');

  const __html = handleLists?.replace(/\<a/g, '<a target="_blank"');

  const employeeData = form.getValues();

  const copyFormattedText = () => {
    setItemIsCopied(true);

    const range = document.createRange();
    range.selectNode(contentRef?.current!);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand('copy');
    } catch (_error) {
    } finally {
      selection?.removeAllRanges();
    }
  };

  return {
    employeeData,
    toggleModal,
    isModalOpen,
    form,
    value,
    setValue,
    __html,
    itemIsCopied,
    setItemIsCopied,
    contentRef,
    copyFormattedText,
  };
};
