import { addDays, addHours, addMilliseconds, addMinutes, addSeconds } from 'date-fns';

export function objectToValuesArray(obj: any): any[] {
  const values: any[] = [];
  Object.keys(obj).forEach((key) => {
    values.push(obj[key]);
  });

  return values;
}

export function replaceNonAlphaNumeric(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '_');
}

// checks if the given value is a string, not null or undefined
export function isNullOrEmpty(data: string) {
  return data === null || data === undefined || data === '';
}

export function isNullOrUndefined(data: any) {
  return data === null || data === undefined;
}

export function objHasProperty(obj: any, property: string) {
  if (isNullOrUndefined(obj)) {
    return false;
  }
  // check if type is object
  if (typeof obj !== 'object') {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(obj, property);
}

export function paramsToDictionary(
  params: {
    key: string;
    value: any;
  }[]
): { [key: string]: any } {
  const dictionary: { [key: string]: any } = {};
  params.forEach((param) => {
    dictionary[param.key] = param.value;
  });
  return dictionary;
}

export function isProduction(): boolean {
  return process.env['NODE_ENV'] === 'production';
}

export function isNullOrEmptyArray(value: any[]) {
  return value === null || value === undefined || (value as never[])?.length === 0;
}

export function hasDuplicates(array: any[]) {
  // check if array is empty or has only one element
  if (isNullOrEmptyArray(array) || array.length < 2) {
    return false;
  }
  return new Set(array).size !== array.length;
}

export function removeNulls(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeNulls(obj[key]);
    else if (isNullOrEmpty(obj[key])) delete obj[key];
  });
  return obj;
}

export function isEmpty(obj: any) {
  if (isNullOrUndefined(obj)) {
    return true;
  }

  const newObj = removeNulls(obj);

  return Object.keys(newObj).length === 0;
}

export function getExpirationDate(expirationFormat: string, referenceDate?: Date) {
  if (isNullOrEmpty(expirationFormat)) {
    throw new Error('Expiration format is required');
  }
  const now = referenceDate ?? new Date();

  // check if expirationFormat is in seconds or milliseconds or minutes or hours or days into milliseconds
  if (expirationFormat.endsWith('s')) {
    return addSeconds(now, parseInt(expirationFormat.replace('s', '')));
  } else if (expirationFormat.endsWith('m')) {
    return addMinutes(now, parseInt(expirationFormat.replace('m', '')));
  } else if (expirationFormat.endsWith('h')) {
    return addHours(now, parseInt(expirationFormat.replace('h', '')));
  } else if (expirationFormat.endsWith('d')) {
    return addDays(now, parseInt(expirationFormat.replace('d', '')));
  } else if (expirationFormat.endsWith('ms')) {
    return addMilliseconds(now, parseInt(expirationFormat.replace('ms', '')));
  } else {
    throw new Error(
      'Invalid expiration format, format must have time post fix (s, m, h, d, ms). Example: 1d, 1h, 1m, 1s, 1ms'
    );
  }
}
