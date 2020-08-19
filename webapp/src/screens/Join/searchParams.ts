import {Location} from 'history';

export const searchParams = (location: Location) => {
  if (!location.search) return {};
  return location.search
    .substr(1)
    .split('&')
    .reduce(function (result: any, item: string) {
      const match = item.split('='),
        key = '' + match[0],
        value = match[1] && decodeURIComponent(match[1]);
      result[key] = result[key] || [];
      result[key].push(value);
      return result;
    }, {} as any);
};
