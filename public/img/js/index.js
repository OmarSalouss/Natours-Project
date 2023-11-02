import '@babel/polyfill'
import { displayMap } from './mapbox';
import { login } from './login';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');

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
