import axios from 'axios';

export const login = async (email, password) => {
 try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === "Success") {
      alert('Log in Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log("res");
    console.log(res);
  } catch (error) {
    alert(error.response.data.message);

  }
};

