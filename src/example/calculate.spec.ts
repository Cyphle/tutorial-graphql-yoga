import { calculate } from './calculate';

describe('calculate', () => {
  it('should calculate', () => {
    const result = calculate(1, 2);

    expect(result).toEqual(3);
  });
});