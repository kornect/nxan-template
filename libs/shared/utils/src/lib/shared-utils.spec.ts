import {
  getExpirationDate,
  hasDuplicates,
  isNullOrEmptyArray,
  isNullOrUndefined,
  objectToValuesArray, objHasProperty,
  paramsToDictionary,
  removeNulls,
  replaceNonAlphaNumeric
} from './shared-utils';

describe('shared-utils', () => {
  describe('objHasProperty', () => {
    it('should check if object has property', () => {
      const actual1 = objHasProperty({ a: 1, b: 2, c: 3 }, 'a');
      const actual2 = objHasProperty({ a: 1, b: 2, c: 3 }, 'x');
      const actual3 = objHasProperty(null, 'c');

      expect(actual1).toBeTruthy()
      expect(actual2).toBeFalsy();
      expect(actual3).toBeFalsy();
    });
  });

  describe('objectToValuesArray', () => {
    it('should convert object to values array', () => {
      const expected = [1, 2, 3];
      const notExpected = ['1', '1', '1', '1'];
      const actual = objectToValuesArray({ a: 1, b: 2, c: 3 });

      expect(actual).toEqual(expected);
      expect(actual).not.toEqual(notExpected);
    });

    it('should convert object to values array', () => {
      const expected: unknown[] = [];
      const actual = objectToValuesArray({});

      expect(actual).toEqual(expected);
    });
  });

  describe('replaceNonAlphaNumeric', () => {
    it('should replace non alphanumeric characters', () => {
      const expected = 'a_b_c';
      const actual = replaceNonAlphaNumeric('a b c');

      expect(actual).toEqual(expected);
    });
    it('should replace non alphanumeric characters', () => {
      const expected = 'abc';
      const actual = replaceNonAlphaNumeric('abc');

      expect(actual).toEqual(expected);
    });
  });

  describe('isNullOrEmptyArray', () => {
    it('should check if array is null', () => {
      const expected = true;
      const actual = isNullOrEmptyArray(null);

      expect(actual).toEqual(expected);
    });

    it('should check if array is undefined', () => {
      const expected = true;
      const actual = isNullOrEmptyArray(undefined);

      expect(actual).toEqual(expected);
    });

    it('should check if array is empty', () => {
      const expected = true;
      const actual = isNullOrEmptyArray([]);

      expect(actual).toEqual(expected);
    });

    it('should check if array is not empty', () => {
      const expected = false;
      const actual = isNullOrEmptyArray([1, 2]);

      expect(actual).toEqual(expected);
    });
  });

  describe('isNullOrUndefined', () => {
    it('should check if value is null', () => {
      const expected = true;
      const actual = isNullOrUndefined(null);

      expect(actual).toEqual(expected);
    });

    it('should check if value is undefined', () => {
      const expected = true;
      const actual = isNullOrUndefined(undefined);

      expect(actual).toEqual(expected);
    });

    it('should check if value is undefined', () => {
      const expected = false;
      const actual = isNullOrUndefined({ a: 1, b: 2, c: 3 });

      expect(actual).toEqual(expected);
    });
  });

  describe('paramsToDictionary', () => {
    it('should convert params to dictionary', () => {
      const expected = { a: '1', b: '2', c: '3' };
      const actual = paramsToDictionary([
        { key: 'a', value: '1' },
        { key: 'b', value: '2' },
        { key: 'c', value: '3' },
      ]);

      expect(actual).toEqual(expected);
    });
  });

  describe('hasDuplicates', () => {
    it('should check if array has duplicates', () => {
      const expected = true;
      const actual = hasDuplicates([1, 2, 3, 1]);

      expect(actual).toEqual(expected);
    });

    it('should check if array has no duplicates', () => {
      const expected = false;
      const actual = hasDuplicates([1, 2, 3]);

      expect(actual).toEqual(expected);
    });
  });

  describe('removeNulls', () => {
    it('should remove nulls from object', () => {
      const expected = { a: 1, c: 3 };
      const actual = removeNulls({ a: 1, b: null, c: 3 });

      expect(actual).toEqual(expected);
    });
  });

  describe('getExpirationDate', () => {
    it('should return expiration date', () => {
      const expected = new Date(2020, 1, 1, 3, 0, 0);
      const actual = getExpirationDate('3h', new Date(2020, 1, 1));

      expect(actual).toEqual(expected);
    });
    it('should return expiration date', () => {
      const expected = new Date(2020, 1, 1, 0, 3, 0);
      const actual = getExpirationDate('3m', new Date(2020, 1, 1));

      expect(actual).toEqual(expected);
    });
    it('should throw invalid error', () => {
      expect(() => getExpirationDate('3', new Date(2020, 1, 1))).toThrowError(
        'Invalid expiration format, format must have time post fix (s, m, h, d, ms). Example: 1d, 1h, 1m, 1s, 1ms'
      );
    });
    it('should throw expiresIn required error', () => {
      expect(() => getExpirationDate('', new Date(2020, 1, 1))).toThrowError('Expiration format is required');
    });
  });
});
