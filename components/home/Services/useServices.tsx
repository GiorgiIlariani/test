'use client';

import { useState, useRef, useEffect } from 'react';

export const useServices = () => {
  const [selectedService, setSelectedService] = useState(0);
  const [listen, setListen] = useState(false);

  const employeeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const invoicesRef = useRef<HTMLDivElement>(null);
  const trafficRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const vacationsRef = useRef<HTMLDivElement>(null);

  const isElementInViewport = (el: HTMLDivElement | null) => {
    const rect = el!.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const handleScroll = () => {
    const isEmployeeInView = isElementInViewport(employeeRef.current);
    isEmployeeInView && setSelectedService(0);

    const projectsInView = isElementInViewport(projectsRef.current);
    projectsInView && setSelectedService(1);

    const invoiceInView = isElementInViewport(invoicesRef.current);
    invoiceInView && setSelectedService(2);

    const trafficInView = isElementInViewport(trafficRef.current);
    trafficInView && setSelectedService(3);

    const reportsInView = isElementInViewport(reportsRef.current);
    reportsInView && setSelectedService(4);

    const vacationsInView = isElementInViewport(vacationsRef.current);
    vacationsInView && setSelectedService(5);
  };

  useEffect(() => {
    listen && window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [invoicesRef, listen]);

  const scrollToSection = (title: string, i: number) => {
    setListen(false);

    title.startsWith('Employee') &&
      employeeRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    title.startsWith('Projects') &&
      projectsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    title.startsWith('Invoicing') &&
      invoicesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    title.startsWith('Staffing') &&
      trafficRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    title.startsWith('Reports') &&
      reportsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    title.startsWith('Time') &&
      vacationsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    setSelectedService(i);
  };

  return {
    selectedService,
    scrollToSection,
    employeeRef,
    projectsRef,
    invoicesRef,
    trafficRef,
    reportsRef,
    vacationsRef,
    setListen,
  };
};
