export default function modalWindows() {
  /* global document */
  const modalReg = document.querySelector('#reg-modal');
  const modalAuth = document.querySelector('#auth-modal');
  const regButton1 = document.querySelector('#reg1');
  const regButton2 = document.querySelector('#reg2');
  const authButton1 = document.querySelector('#auth1');
  const authButton2 = document.querySelector('#auth2');
  const regSwipe = document.querySelector('#reg-swipe');
  const authSwipe = document.querySelector('#auth-swipe');

  regSwipe.addEventListener('swiped-down', () => {
    modalReg.classList.add('hidden');
  });

  regButton1.addEventListener('click', () => {
    modalReg.classList.remove('hidden');
  });

  regButton2.addEventListener('click', () => {
    modalReg.classList.remove('hidden');
  });

  authSwipe.addEventListener('swiped-down', () => {
    modalAuth.classList.add('hidden');
  });

  authButton1.addEventListener('click', () => {
    modalAuth.classList.remove('hidden');
  });

  authButton2.addEventListener('click', () => {
    modalAuth.classList.remove('hidden');
  });
}
