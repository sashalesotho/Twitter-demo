import { assert } from 'chai';
import validateEmail from '../public/assets/is_valid_email.js';
/* global describe, it */
describe('Функция проверки валидности email-адреса', function () {
  it('валидный email-адрес', function () {
    const expectedResult = true;
    const result = validateEmail('example@example.com');
    assert.equal(expectedResult, result);
  });

  it('невалидный email-адрес', function () {
    const expectedResult = false;
    const result = validateEmail('example.com');
    assert.equal(expectedResult, result);
  });

  it('невалидный email-адрес', function () {
    const expectedResult = false;
    const result = validateEmail('example@.com');
    assert.equal(expectedResult, result);
  });

  it('валидный email-адрес', function () {
    const expectedResult = true;
    const result = validateEmail('example.name@example.com');
    assert.equal(expectedResult, result);
  });

  it('невалидный email-адрес', function () {
    const expectedResult = false;
    const result = validateEmail('example@com');
    assert.equal(expectedResult, result);
  });

  it('невалидный email-адрес', function () {
    const expectedResult = false;
    const result = validateEmail('example@');
    assert.equal(expectedResult, result);
  });

  it('невалидный email-адрес', function () {
    const expectedResult = false;
    const result = validateEmail('example');
    assert.equal(expectedResult, result);
  });
});
