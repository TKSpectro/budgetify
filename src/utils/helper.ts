import { subMinutes } from 'date-fns';

/**
 * Rounds a number on 2 decimal places
 * @param number Number to be rounded
 */
export const roundOn2 = (number: number) => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

/**
 * Regex for detecting the validity of UUID's
 */
export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Converts a JS Date object to a string usable by html inputs with date type
 * @param date The date which should be converted
 */
export const dateToFormInput = (date: Date) => {
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);

  return date.getFullYear() + '-' + month + '-' + day;
};

/**
 * Calculates a date with a Timezone offset of +0
 * This is needed for SSR where client and server are in different timezones
 * @param date The date which should be converted to UTC +0 Timezone
 */
export const removeDateOffset = (date: Date) => {
  return subMinutes(date, new Date().getTimezoneOffset());
};

/**
 * Returns the base url of the website.
 * Either the specified base url or https://DOMAIN (taken from .env)
 */
export const getBaseUrl = () => {
  return process.env.BASE_URL || 'https://' + process.env.DOMAIN;
};

/**
 * Returns the string with the last part cut off (/api/households/1 -> /api/households)
 * @param param The url which should be cut
 */
export const urlOneUp = (url: String) => {
  return url.substring(0, url.lastIndexOf('/'));
};
