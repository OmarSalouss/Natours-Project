import '@babel/polyfill'
import { displayMap } from './mapbox';
import { login } from './login';

const locations = JSON.parse(document.getElementById('map').dataset.locations);

displayMap(locations);

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();// this prevents the form from la-loading any other page.
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});