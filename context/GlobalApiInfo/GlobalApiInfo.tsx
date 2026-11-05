'use client';

import React, { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import {
  AuthUser,
  Department,
  Position,
  Recruiter,
  Seniority,
  Skill,
  Notification,
  SetState,
  Holiday,
  UserOrganization,
  ApplicationConfigs,
} from 'types';
import {
  getApplicationConfigs,
  getAuthUser,
  getCurrencyRatesRequest,
  getDepartmentsRequest,
  getIndustriesRequest,
  getNotifications,
  getPositionsRequest,
  getProjectManagers,
  getPublicHolidays,
  getSenioritiesRequest,
  getSkillsRequest,
  getUserOrganizations,
} from 'services';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { shouldResourceBeLoadedOnPage } from './helpers';
import { ROUTES_TO_DELAY_CONTEXT_LOAD_FOR } from 'config';
import { getUserTokenInfo, serializeEndUserCookie, toastGeneralError } from 'helpers';

export const GlobalApiInfo = createContext<{
  seniorities: Seniority[];
  rawSeniorities: Seniority[];
  positions: Position[];
  departments: Department[];
  skills: Skill[];
  industries: string[];
  user: AuthUser;
  userOrganizations: UserOrganization[];
  notificationSum: number;
  notifications: Notification[];
  setNotificationSum: SetState<number>;
  setNotifications: SetState<Notification[]>;
  currencyRates: {
    [key: string]: number;
  };
  projectManagers: Recruiter[];
  setDelay: SetState<boolean>;
  setUser: SetState<AuthUser>;
  refetchUser: () => void;
  publicHolidays: { country: string; holidays: Holiday[] };
  applicationConfigs: ApplicationConfigs;
}>({
  seniorities: [],
  rawSeniorities: [],
  positions: [],
  departments: [],
  skills: [],
  industries: [],
  user: {
    active: false,
    avatar: '',
    email: '',
    first_name: '',
    id: 0,
    last_name: '',
    permissions: [],
    role: 'sale',
    name: '',
    title: '',
  },
  userOrganizations: [],
  notificationSum: 0,
  notifications: [],
  publicHolidays: { country: '', holidays: [] },
  setNotificationSum: () => {},
  setNotifications: () => {},
  currencyRates: {},
  projectManagers: [],
  setDelay: () => {},
  setUser: () => {},
  refetchUser: () => {},
  applicationConfigs: {
    time_off: {
      yearly_vacation_days: 24,
      trial_period: 11,
      trial_bonus_days: 5,
      final_reviewer: 0,
    },
    currency: {
      currency: '',
      all_currencies: ['GEL', 'USD', 'GBP', 'EUR'],
    },
    gross_to_net_multiplier: 1,
  },
});

const GlobalApiInfoProvider: React.FC<{
  children: ReactNode;
}> = (props) => {
  const router = useRouter();
  const [seniorities, setSeniorities] = useState<Seniority[]>([]);
  const [rawSeniorities, setRawSeniorities] = useState<Seniority[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSum, setNotificationSum] = useState<number>(0);
  const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([]);
  const [applicationConfigs, setApplicationConfigs] = useState<ApplicationConfigs>({
    time_off: {
      yearly_vacation_days: 24,
      trial_period: 11,
      trial_bonus_days: 5,
      final_reviewer: 0,
    },
    currency: {
      currency: '',
      all_currencies: ['GEL', 'USD', 'GBP', 'EUR'],
    },
    gross_to_net_multiplier: 1,
  });

  const [currencyRates, setCurrencyRates] = useState<{
    [key: string]: number;
  }>({});
  const [projectManagers, setProjectManagers] = useState<Recruiter[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<{ country: string; holidays: Holiday[] }>({
    country: '',
    holidays: [],
  });
  const infoLoaded = useRef<{
    [key: string]: boolean;
  }>({});
  const [delay, setDelay] = useState(ROUTES_TO_DELAY_CONTEXT_LOAD_FOR.includes(router.pathname));

  const [user, setUser] = useState<AuthUser>({
    active: false,
    avatar: '',
    email: '',
    first_name: '',
    id: 0,
    last_name: '',
    permissions: [],
    role: 'sale',
    name: '',
    title: '',
    is_billable: 0,
  });

  const [refetch, setRefetch] = useState(false);

  const refetchUser = () => setRefetch((prev) => !prev);

  useEffect(() => {
    (async () => {
      try {
        const token = getCookie('token');
        if (typeof token !== 'string' || !getUserTokenInfo(token)?.tenant) return;

        const user = await getAuthUser(token);
        if (!user?.data) return;

        setUser(() => user.data);
        setCookie('end-user', serializeEndUserCookie(user.data));
      } catch (_) {}
    })();
  }, [refetch]);

  useEffect(() => {
    const routeChangeHandler = (route: string) => {
      if (ROUTES_TO_DELAY_CONTEXT_LOAD_FOR.includes(route)) {
        setDelay(true);
      }
    };

    router.events.on('routeChangeComplete', routeChangeHandler);
    return () => {
      router.events.off('routeChangeComplete', routeChangeHandler);
    };
  }, [router]);

  useEffect(() => {
    const getUser = async () => {
      if (getCookie('token')) {
        try {
          const usersCookie = getCookie('end-user');
          const user = JSON.parse(usersCookie as string);
          return user;
        } catch (_) {}
      }
    };

    const getInfo = async () => {
      const [
        loadedPositions,
        loadedDepartments,
        loadedSeniorities,
        loadedSkills,
        loadedIndustries,
        authUser,
        notificationData,
        loadedCurrencyRates,
        loadedProjectManagers,
        loadedUserOrganizations,
        loadedApplicationConfigs,
      ] = await Promise.all([
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'positions',
          infoLoaded.current.positions,
          getPositionsRequest,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'departments',
          infoLoaded.current.departments,
          getDepartmentsRequest,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'seniorities',
          infoLoaded.current.seniorities,
          getSenioritiesRequest,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'skills',
          infoLoaded.current.skills,
          getSkillsRequest,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'industries',
          infoLoaded.current.industries,
          getIndustriesRequest,
        ),

        getUser(),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'notifications',
          infoLoaded.current.notifications,
          getNotifications,
          true,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'currencies',
          infoLoaded.current.currencies,
          getCurrencyRatesRequest,
          true,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'projectManagers',
          infoLoaded.current.projectManagers,
          getProjectManagers,
          true,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'userOrganizations',
          infoLoaded.current.userOrganizations,
          getUserOrganizations,
          true,
        ),
        shouldResourceBeLoadedOnPage(
          router.pathname,
          'applicationConfigs',
          infoLoaded.current.applicationConfigs,
          getApplicationConfigs,
          true,
        ),
      ]);

      if (loadedApplicationConfigs) {
        setApplicationConfigs(loadedApplicationConfigs);
        infoLoaded.current.applicationConfigs = true;
      }

      if (loadedProjectManagers) {
        setProjectManagers(loadedProjectManagers.data);
        infoLoaded.current.projectManagers = true;
      }

      if (loadedCurrencyRates) {
        setCurrencyRates(loadedCurrencyRates);
        infoLoaded.current.currencies = true;
      }

      if (notificationData) {
        setNotifications(notificationData);
        setNotificationSum(
          notificationData.filter((notification: Notification) => !notification.seen)?.length,
        );
        infoLoaded.current.notifications = true;
      }
      if (loadedPositions) {
        setPositions(loadedPositions.data);
        infoLoaded.current.positions = true;
      }

      if (loadedDepartments) {
        setDepartments(loadedDepartments.data);
        infoLoaded.current.departments = true;
      }

      if (loadedSeniorities) {
        let allSeniorities: Seniority[] = [];

        const flattenHierarchy = (seniority: Seniority) => {
          allSeniorities.push(seniority);
          if (seniority?.children?.length) {
            seniority?.children?.forEach((child) => flattenHierarchy(child));
          }
        };

        loadedSeniorities.data?.forEach((parent) => flattenHierarchy(parent));

        setSeniorities(allSeniorities);
        setRawSeniorities(loadedSeniorities.data);
        infoLoaded.current.seniorities = true;
      }

      if (loadedSkills) {
        setSkills(loadedSkills.data);
        infoLoaded.current.skills = true;
      }

      if (loadedIndustries) {
        setIndustries(loadedIndustries);
        infoLoaded.current.industries = true;
      }

      if (!infoLoaded.current.authUser) {
        // The cookie holds a slimmed-down user, so keep fields like avatar from /user.
        setUser((prev) => ({ ...prev, ...authUser }));
        infoLoaded.current.authUser = true;
      }

      if (loadedUserOrganizations) {
        setUserOrganizations(loadedUserOrganizations);
        infoLoaded.current.userOrganizations;
      }
    };
    if (!delay) {
      getInfo();
    }
  }, [delay, router.pathname]);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) return;

    (async () => {
      try {
        const holidays = await getPublicHolidays(token, 'all');
        setPublicHolidays(holidays);
      } catch (error) {
        toastGeneralError(error);
      }
    })();
  }, []);

  return (
    <GlobalApiInfo.Provider
      value={{
        seniorities,
        rawSeniorities,
        positions,
        departments,
        skills,
        industries,
        user,
        notificationSum,
        notifications,
        setNotificationSum,
        setNotifications,
        currencyRates,
        projectManagers,
        setDelay,
        setUser,
        refetchUser,
        publicHolidays,
        userOrganizations,
        applicationConfigs,
      }}
    >
      {props.children}
    </GlobalApiInfo.Provider>
  );
};

export default GlobalApiInfoProvider;
