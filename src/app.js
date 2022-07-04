import { createModal, isValid } from './utils';
import { Question } from './question';
import './style.css';
import { getAuthForm, authWithEmailAndPassword } from './auth';

const form = document.querySelector('#form');
const modalBtn = document.querySelector('#modal-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value);
});

function submitFormHandler(event) {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };

    submitBtn.disabled = true;

    // request
    Question.create(question).then(() => {
      input.value = '';
      input.className = '';
      submitBtn.disabled = false;
    });
  }
}

function openModal() {
  createModal('Autorize', getAuthForm());
  document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true });
}

function authFormHandler(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button');
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  btn.disabled = true;
  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => (btn.disabled = true));
}

function renderModalAfterAuth(content) {
  // console.log(content);
  if (typeof content === 'string') {
    createModal('Ошибка', content);
  } else {
    createModal('Список вопросов', Question.listToHTML(content));
  }
}
