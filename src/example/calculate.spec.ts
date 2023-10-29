import { calculate } from './calculate';
import { expect, describe, it } from '@jest/globals';

describe('calculate', () => {
  it('should calculate', () => {
    const result = calculate(1, 2);

    expect(result).toEqual(3);
  });
});