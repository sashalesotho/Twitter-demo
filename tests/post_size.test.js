import { assert } from 'chai';
import postSize from '../public/assets/post_size.js';

describe('Функция проверки расчета размера поста', function () {
  it('без ссылок', function () {
    const expectedResult = 12;
    const result = postSize('Всем привет!');
    assert.equal(expectedResult, result);
  });

  it('одна ссылка', function () {
    const expectedResult = 12;
    const result = postSize('Всем привет! https://github.com');
    assert.equal(expectedResult, result);
  });

  it('только ссылки', function () {
    const expectedResult = 0;
    const result = postSize('youtube.com https://github.com instagram.com');
    assert.equal(expectedResult, result);
  });

  it('две ссылки без пробела', function () {
    const expectedResult = 0;
    const result = postSize('youtube.comhttps://github.com');
    assert.equal(expectedResult, result);
  });

  it('ссылка после текста без пробела', function () {
    const expectedResult = 4;
    const result = postSize('Всем привет!https://github.com');
    assert.equal(expectedResult, result);
  });

  it('текст после ссылки без пробела', function () {
    const expectedResult = 7;
    const result = postSize('https://github.comВсем привет!');
    assert.equal(expectedResult, result);
  });

  it('ссылка с ошибкой', function () {
    const expectedResult = 24;
    const result = postSize('Всем привет! youtube,com');
    assert.equal(expectedResult, result);
  });

  it('пустая строка', function () {
    const expectedResult = 0;
    const result = postSize('');
    assert.equal(expectedResult, result);
  });

  it('ссылка без домена, но с протоколом', function () {
    const expectedResult = 12;
    const result = postSize('Всем привет! https://github');
    assert.equal(expectedResult, result);
  });

  it('ссылка без домена, но с префиксом', function () {
    const expectedResult = 12;
    const result = postSize('Всем привет! www.instagram');
    assert.equal(expectedResult, result);
  });

  it('ссылка без протокола и префикса, но с доменом', function () {
    const expectedResult = 12;
    const result = postSize('Всем привет! github.com');
    assert.equal(expectedResult, result);
  });
});