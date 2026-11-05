import { hasCookie, getCookie, setCookie } from 'cookies-next';
import { AnyObject, AuthUser, UserTokenInfo } from 'types';
import { addHours } from './utils';

export const getFutureDate = (days: number) => {
  const date = new Date();
  return addHours(date, days * 24);
};

/**
 * stores field names in cookies,
 *
 *
 * if field name is from useFieldArray it only works with 1 level nested
 * like this: project.0.name,
 * but won't work with project.0.technology.0.name, or project.name,
 * @param field string
 * @param value string
 * @param cookieName string
 */
export const storeFieldInCookieObject = (
  field: string,
  value: string | object,
  cookieName: string,
  needsArray?: boolean,
) => {
  const cookieCheck = hasCookie(cookieName);
  let newCookies: AnyObject = {};
  if (cookieCheck) {
    newCookies = {
      ...JSON.parse(getCookie(cookieName) as string),
    };
  }
  const fields = field?.split('.');
  if (needsArray) {
    newCookies[fields[0]] = newCookies[fields[0]] || [];
    const indexOfField = newCookies[fields[0]].findIndex(
      (item: any) => item?.id === (value as AnyObject)?.id,
    );
    if (indexOfField !== -1) {
      newCookies[fields[0]][fields[1]] = value;
    } else {
      newCookies[fields[0]].push(value);
    }
  } else if (fields.length === 1) {
    newCookies[field] = value;
  } else {
    newCookies[fields[0]] = newCookies[fields[0]] || [{}];
    if (!newCookies[fields[0]][fields[1]]) {
      newCookies[fields[0]].push({
        [fields[2]]: value,
      });
    } else {
      newCookies[fields[0]][fields[1]][fields[2]] = value;
    }
  }
  setCookie(cookieName, JSON.stringify(newCookies), {
    expires: getFutureDate(5),
  });
};

export const modifySkillInACookie = (
  skillName: string,
  value: string | AnyObject,
  cookieName: string,
  field: string,
  removing?: boolean,
) => {
  const cookieCheck = hasCookie(cookieName);

  let newCookies: {
    [key: string]: any;
  } = {};
  if (cookieCheck) {
    newCookies = {
      ...JSON.parse(getCookie(cookieName) as string),
    };
  }
  let skills = newCookies[skillName] || [];
  let skillIndex = skills?.findIndex((skill: any) => skill?.id === (value as AnyObject)?.id);
  if (!skills[skillIndex]) {
    return false;
  }
  if (removing) {
    skills = skills.filter((skill: any) => skill?.id != (value as AnyObject)?.id);
  } else {
    skills[skillIndex][field] = (value as AnyObject)[field];
  }
  newCookies[skillName] = skills;
  setCookie(cookieName, JSON.stringify(newCookies), {
    expires: getFutureDate(5),
  });
};

export const handleProjectTechnologyInACookie = (
  field: string,
  value: string | object,
  cookieName: string,
  removing?: boolean,
) => {
  const cookieCheck = hasCookie(cookieName);

  let newCookies: AnyObject = {};

  if (cookieCheck) {
    newCookies = {
      ...JSON.parse(getCookie(cookieName) as string),
    };
  }
  const fields = field?.split('.');

  newCookies[fields[0]] = newCookies[fields[0]] || [[]];

  newCookies[fields[0]][fields[1]] = newCookies[fields[0]][fields[1]] || {};

  newCookies[fields[0]][fields[1]][fields[2]] = newCookies[fields[0]][fields[1]][fields[2]] || [];

  if (removing) {
    const newTechnology = [];
    for (const tech of newCookies[fields[0]][fields[1]][fields[2]]) {
      if (tech?.id != (value as AnyObject)?.id) {
        newTechnology.push(tech);
      }
    }
    newCookies[fields[0]][fields[1]][fields[2]] = newTechnology;
  }

  if (
    newCookies[fields[0]][fields[1]][fields[2]]?.findIndex(
      (item: any) => item.id == (value as AnyObject).id,
    ) === -1 &&
    !removing
  ) {
    newCookies[fields[0]][fields[1]][fields[2]].push(value);
  }
  setCookie(cookieName, JSON.stringify(newCookies), {
    expires: getFutureDate(5),
  });
};

export const getUserToken = () => {
  const userToken = getCookie('token');
  if (typeof userToken !== 'string') return;

  return userToken;
};

const base64UrlDecode = (str: string) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4 !== 0) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
};

export const getUserTokenInfo = (userToken = getUserToken()) => {
  if (!userToken) return;

  let token;
  try {
    if (userToken) token = base64UrlDecode(userToken?.split('.')[1]);
  } catch {}

  if (!token) return;
  const decodedToken: UserTokenInfo = JSON.parse(token);

  return decodedToken;
};

/**
 * Browsers ignore a cookie whose name and value together exceed this many bytes.
 */
export const MAX_COOKIE_SIZE = 4096;

/**
 * 18 minutes, in seconds. Use `maxAge` rather than `expires` so a user whose
 * computer clock runs ahead doesn't receive an already-expired cookie.
 */
export const END_USER_COOKIE_MAX_AGE = 0.3 * 60 * 60;

/**
 * Serializes only the fields that are read back from the `end-user` cookie.
 * Browsers silently drop cookies over 4096 bytes, and storing the whole
 * auth user (presigned avatar URL included) pushed some users over that limit.
 */
export const serializeEndUserCookie = (user: AuthUser) => {
  const { id, first_name, last_name, name, email, role, permissions, is_billable } = user;
  return JSON.stringify({
    id,
    first_name,
    last_name,
    name,
    email,
    role,
    permissions,
    is_billable,
  });
};
