import { assert } from 'chai';
import convertTime from '../public/assets/convert_time.js';
/* global describe, it */
describe('Функция проверки расчета времени, прошедшего с момента публикации поста', function () {
  it('разница – 60 минут', function () {
    const expectedResult = '1 час назад';
    const result = convertTime(new Date('2022-01-01T12:00:00Z'), new Date('2022-01-01T13:01:00Z'));
    assert.equal(expectedResult, result);
  });

  it('разница – 24 часа', function () {
    const expectedResult = '1 день назад';
    const result = convertTime(new Date('2022-01-01T00:00:00Z'), new Date('2022-01-02T00:00:00Z'));
    assert.equal(expectedResult, result);
  });

  it('разница - 365 дней', function () {
    const expectedResult = '1 год назад';
    const result = convertTime(new Date('2021-01-01T00:00:00Z'), new Date('2022-01-01T00:00:00Z'));
    assert.equal(expectedResult, result);
  });

  it('разница – 1 минута', function () {
    const expectedResult = '1 минуту назад';
    const result = convertTime(new Date('2022-01-01T12:00:00Z'), new Date('2022-01-01T12:01:00Z'));
    assert.equal(expectedResult, result);
  });

  it('разница – 59 минут', function () {
    const expectedResult = '59 минут назад';
    const result = convertTime(new Date('2022-01-01T12:00:00Z'), new Date('2022-01-01T12:59:00Z'));
    assert.equal(expectedResult, result);
  });

  it('разница – меньше минуты', function () {
    const expectedResult = 'только что';
    const result = convertTime(new Date('2022-01-01T12:00:00Z'), new Date('2022-01-01T12:00:30Z'));
    assert.equal(expectedResult, result);
  });

  it('разница - 5 дней', function () {
    const expectedResult = '5 дней назад';
    const result = convertTime(new Date('2022-01-01T12:00:00Z'), new Date('2022-01-06T12:00:00Z'));
    assert.equal(expectedResult, result);
  });

  it('разница – 2 года', function () {
    const expectedResult = '2 года назад';
    const result = convertTime(new Date('2022-01-01T12:00:00Z'), new Date('2024-01-01T12:00:00Z'));
    assert.equal(expectedResult, result);
  });
});
