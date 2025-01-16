import { assert } from 'chai';
import highlightHashtags from '../assets/highlight_hashtags.js';
/* global describe, it */
describe('Функция проверки подсветки хештегов', function () {
  it('один хештег в тексте', function () {
    const expectedResult = "Кто еще изучает <a href='/search?tag=javascript' >#javascript</a> ?";
    const result = highlightHashtags('Кто еще изучает #javascript ?');
    assert.equal(expectedResult, result);
  });

  it('без хештегов', function () {
    const expectedResult = 'Кто еще изучает javascript ?';
    const result = highlightHashtags('Кто еще изучает javascript ?');
    assert.equal(expectedResult, result);
  });

  it('только хештеги', function () {
    const expectedResult = "<a href='/search?tag=javascript' >#javascript</a> <a href='/search?tag=frontend' >#frontend</a> <a href='/search?tag=IT' >#IT</a>";
    const result = highlightHashtags('#javascript #frontend #IT');
    assert.equal(expectedResult, result);
  });

  it('хештеги через запятую', function () {
    const expectedResult = "<a href='/search?tag=javascript' >#javascript</a>, <a href='/search?tag=frontend' >#frontend</a>, <a href='/search?tag=IT' >#IT</a>";
    const result = highlightHashtags('#javascript, #frontend, #IT');
    assert.equal(expectedResult, result);
  });

  it('знаки препинания не отделены пробелами, в конце предложения', function () {
    const expectedResult = "Кто еще изучает <a href='/search?tag=javascript' >#javascript</a>?";
    const result = highlightHashtags('Кто еще изучает #javascript?');
    assert.equal(expectedResult, result);
  });

  it('знаки препинания не отделены пробелами, в середине предложения', function () {
    const expectedResult = "Кто еще изучает <a href='/search?tag=javascript' >#javascript</a>, <a href='/search?tag=tipescript' >#tipescript</a>, python?";
    const result = highlightHashtags('Кто еще изучает #javascript, #tipescript, python?');
    assert.equal(expectedResult, result);
  });

  it('пустая строка', function () {
    const expectedResult = ' ';
    const result = highlightHashtags(' ');
    assert.equal(expectedResult, result);
  });
});
