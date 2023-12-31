import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    console.log("login = 111")
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === "Success") {
      showAlert('success', 'Log in Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log("res");
    console.log(res);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    if (res.data.status === "Success") location.reload(true);
  } catch (error) {
    console.log(error.response);
    showAlert('error', 'Error logging out! Try again');
  }
};