import { subMinutes } from 'date-fns';

export const roundOn2 = (number: number) => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// This function takes a js date object and converts it to a date string a html date input can use
export const dateToFormInput = (date: Date) => {
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);

  return date.getFullYear() + '-' + month + '-' + day;
};

// This function takes a js date object and calculates the time which it would be for UTC +0
export const removeDateOffset = (date: Date) => {
  return subMinutes(date, new Date().getTimezoneOffset());
};

// Returns the base url of the website. Either the specified base url or https://DOMAIN
export const getBaseUrl = () => {
  return process.env.BASE_URL || 'https://' + process.env.DOMAIN;
};

// Returns the string with the last part cut off (/api/households/1 -> /api/households)
export const urlOneUp = (url: String) => {
  return url.substring(0, url.lastIndexOf('/'));
};
