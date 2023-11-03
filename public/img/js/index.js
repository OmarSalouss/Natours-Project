import '@babel/polyfill'
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (mapbox) {
    console.log("Not Null mapbox")
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
}

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();// this prevents the form from la-loading any other page.
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);