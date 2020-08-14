import {useFind} from 'react-pouchdb/browser';

export const useProfile = (selector = {}) =>
  useFind('me', {
    selector: selector,
  });
