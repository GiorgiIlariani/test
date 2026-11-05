import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { END_USER_COOKIE_MAX_AGE, MAX_COOKIE_SIZE, serializeEndUserCookie } from 'helpers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from 'services';
import * as Sentry from '@sentry/nextjs';

const controller = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = getCookie('token', {
    req,
    res,
  });
  try {
    const data = await getAuthUser(token);
    const endUser = serializeEndUserCookie(data.data);

    // Browsers silently ignore cookies over 4096 bytes, which would loop the user back here.
    const cookieSize = 'end-user='.length + encodeURIComponent(endUser).length;
    if (cookieSize > MAX_COOKIE_SIZE) {
      Sentry.captureMessage('end-user cookie is too large for the browser to store', {
        extra: { userId: data.data.id, cookieSize },
      });
      return res.redirect(307, '/session-error');
    }

    setCookie('end-user', endUser, {
      req,
      res,
      maxAge: END_USER_COOKIE_MAX_AGE,
    });
  } catch (error) {
    deleteCookie('tenant-url', {
      req,
      res,
    });
    deleteCookie('token', {
      req,
      res,
    });
    deleteCookie('impersonation_token', {
      req,
      res,
    });
    deleteCookie('end-user', {
      req,
      res,
    });
    console.error(error);
  }

  const intendedUrl = atob(req.query.intended_url?.toString() ?? '');
  res.status(307).redirect(intendedUrl ?? '/');
};

export default controller;
