import { assert } from 'chai';
import replaceLinks from '../public/assets/replace_links.js';
/* global describe, it */
describe('Функция проверки замены ссылок', function () {
  it('одна ссылка', function () {
    const expectedResult = "Мой гитхаб: <a href='https://github.com/sashalesotho'>https://github.com/sashalesotho</a>";
    const result = replaceLinks('Мой гитхаб: https://github.com/sashalesotho');
    assert.equal(expectedResult, result);
  });

  it('без ссылок', function () {
    const expectedResult = 'Мой гитхаб: sashalesotho';
    const result = replaceLinks('Мой гитхаб: sashalesotho');
    assert.equal(expectedResult, result);
  });

  it('несколько ссылок и знаки препинания', function () {
    const expectedResult = "Мои соцсети: <a href='vk.ru/examplename'>vk.ru/examplename</a>, <a href='www.instagram.com/examplename'>www.instagram.com/examplename</a>!";
    const result = replaceLinks('Мои соцсети: vk.ru/examplename, www.instagram.com/examplename!');
    assert.equal(expectedResult, result);
  });

  it('ссылки без протокола', function () {
    const expectedResult = "Мой гитхаб: <a href='github.com/sashalesotho'>github.com/sashalesotho</a>";
    const result = replaceLinks('Мой гитхаб: github.com/sashalesotho');
    assert.equal(expectedResult, result);
  });

  it('без поддомена – не ссылка', function () {
    const expectedResult = 'Мой гитхаб: https://github/sashalesotho';
    const result = replaceLinks('Мой гитхаб: https://github/sashalesotho');
    assert.equal(expectedResult, result);
  });

  it('ссылки с путями', function () {
    const expectedResult = "Почитать: <a href='https://developer.mozilla.org/ru/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL'>https://developer.mozilla.org/ru/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL</a>";
    const result = replaceLinks('Почитать: https://developer.mozilla.org/ru/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL');
    assert.equal(expectedResult, result);
  });

  it('ссылки с путями и ключами', function () {
    const expectedResult = "Почитать: <a href='https://ru.wikipedia.org/w/index.php?title=%D0%9C%D0%B0%D1%80%D1%81&action=history'>https://ru.wikipedia.org/w/index.php?title=%D0%9C%D0%B0%D1%80%D1%81&action=history</a>";
    const result = replaceLinks('Почитать: https://ru.wikipedia.org/w/index.php?title=%D0%9C%D0%B0%D1%80%D1%81&action=history');
    assert.equal(expectedResult, result);
  });

  it('ссылки с якорями', function () {
    const expectedResult = "Почитать: <a href='https://ru.wikipedia.org/wiki/%D0%94%D1%83%D0%BD%D0%BA%D0%B0%D0%BD_I#%D0%93%D0%B8%D0%B1%D0%B5%D0%BB%D1%8C'>https://ru.wikipedia.org/wiki/%D0%94%D1%83%D0%BD%D0%BA%D0%B0%D0%BD_I#%D0%93%D0%B8%D0%B1%D0%B5%D0%BB%D1%8C</a>";
    const result = replaceLinks('Почитать: https://ru.wikipedia.org/wiki/%D0%94%D1%83%D0%BD%D0%BA%D0%B0%D0%BD_I#%D0%93%D0%B8%D0%B1%D0%B5%D0%BB%D1%8C');
    assert.equal(expectedResult, result);
  });
});
