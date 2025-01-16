import convertTime from '../assets/convert_time.js';
import messageTimer from './message-timer.js';

export default async function addAPI() {
  const resStatistic = await fetch('https://burtovoy.github.io/statistic.json');
  const statisticJSON = await resStatistic.json();
  const statisticObj = statisticJSON.statistic;

  document.querySelector('#users-numb').innerHTML = statisticObj.usersRegistr;
  document.querySelector('#messages-numb').innerHTML = statisticObj.writMessages;
  document.querySelector('#today-messages').innerHTML = statisticObj.writToday;

  const loader = document.querySelector('.posts__list-loader');
  fetch('https://burtovoy.github.io/messages.json').then((res) => {
    if (res.ok) {
      loader.classList.add('hidden');
    }
  });

  const resMessages = await fetch('https://burtovoy.github.io/messages.json');
  const messagesJSON = await resMessages.json();
  const messagesArr = messagesJSON.messages;

  const resPictures = await fetch('https://burtovoy.github.io/pictures.json');
  const picturesJSON = await resPictures.json();
  const picturesArr = picturesJSON.pictures;

  let now;
  setInterval(now = Date.now(), 60000);
  let key;

  /* eslint-disable-next-line */
	for (key in messagesArr) {
    if (!messagesArr[key].img_message) {
      document.querySelector('#posts-list').innerHTML
    += `<li class="post" id="${messagesArr[key].id}">
    <div class="post__avatar">
      <img src="${picturesArr[key].url}" alt="аватар" />
    </div>
    <div class="post__body">
      <div class="post__header">
        <div class="user">
        <p class="user__name">${messagesArr[key].name}</p>
        <p class="user__nickname">${messagesArr[key].mail}</p>
        </div>
        <div class="post__time">
        <p>${convertTime(messageTimer(messagesArr[key].date), now)}</p>
        </div>
      </div>
      <div class="post__message">${messagesArr[key].message}</div>
      <div class="stats">
      <div class="stats__item">
        <img src="images/reply.svg" alt="ответить" />
        <p>${messagesArr[key].quantityReposts}</p>
      </div>
      <div class="stats__item">
        <img src="images/heart.svg" alt="сердце" />
        <p>${messagesArr[key].quantityLike}</p>
      </div>
      <div class="stats__item">
        <img src="images/export.svg" alt="поделиться" />
        <p>${messagesArr[key].quantityShare}</p>
      </div>
      </div>
    </div>
  </li>`;
    } else {
      document.querySelector('#posts-list').innerHTML
    += `<li class="post" id="${messagesArr[key].id}">
    <div class="post__avatar">
      <img src="${picturesArr[key].url}" alt="аватар" />
    </div>
    <div class="post__body">
      <div class="post__header">
       <div class="user">
        <p class="user__name">${messagesArr[key].name}</p>
        <p class="user__nickname">${messagesArr[key].mail}</p>
       </div>
       <div class="post__time">
        <p>${convertTime(messageTimer(messagesArr[key].date), now)}</p>
       </div>
      </div>
      <div class="post__message">${messagesArr[key].message}</div>
      <div class="post__image">
       <img src="${messagesArr[key].img_message}" alt="матч" />
      </div>
      <div class="stats">
       <div class="stats__item">
        <img src="images/reply.svg" alt="ответить" />
        <p>${messagesArr[key].quantityReposts}</p>
       </div>
       <div class="stats__item">
        <img src="images/heart.svg" alt="сердце" />
        <p>${messagesArr[key].quantityLike}</p>
       </div>
       <div class="stats__item">
        <img src="images/export.svg" alt="поделиться" />
        <p>${messagesArr[key].quantityShare}</p>
       </div>
      </div>
    </div>
   </li>`;
    }
  }
}
