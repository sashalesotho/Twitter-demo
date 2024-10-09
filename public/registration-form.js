import validateEmail from './assets/is_valid_email.js';

export default function registrationFormValidation() {
  const regForm = document.querySelector('#reg-form');
  const emailInput = document.querySelector('#reg-email');
  const passwordInput = document.querySelector('#reg-password');
  const passwordConfirmInput = document.querySelector('#reg-password-again');

  function validation(form) {
    function removeError(input) {
      const parent = input.parentNode;
      if (parent.classList.contains('error')) {
        parent.querySelector('.error-label').remove();
        parent.classList.remove('error');
      }
    }

    function createError(input, text) {
      const parent = input.parentNode;
      const errorLabel = document.createElement('label');
      errorLabel.classList.add('error-label');
      errorLabel.textContent = text;
      parent.classList.add('error');
      parent.append(errorLabel);
    }

    let result = true;

    const allInputs = form.querySelectorAll('input');
    /* eslint-disable-next-line */
    for (const input of allInputs) {
      removeError(input);

      if (input.value === '') {
        createError(input, 'поле не заполнено');
        result = false;
      }
      if (input === emailInput) {
        if (!validateEmail(emailInput.value)) {
          removeError(emailInput);
          createError(emailInput, 'адрес почты не валиден');
          result = false;
        }
      }
      if (input !== emailInput) {
        if (passwordInput.value !== passwordConfirmInput.value) {
          removeError(passwordConfirmInput);
          createError(passwordConfirmInput, 'пароли не совпадают');
          result = false;
        }
      }
    }

    return result;
  }

  regForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validation(this) === true) {
      console.log(emailInput.value, passwordInput.value, passwordConfirmInput.value);
    }
  });
}
