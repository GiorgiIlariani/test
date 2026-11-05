import { NextRouter } from 'next/router';

export const getDefaultArchiveActiveState = (router: NextRouter) => {
  let archived = router.query.inactive;
  let active = router.query.active;
  if (archived && +archived) {
    let newState = ['active'];
    if (!+active!) {
      newState = ['inactive'];
    } else {
      newState.push('inactive');
    }
    return newState;
  }
  return ['active'];
};
