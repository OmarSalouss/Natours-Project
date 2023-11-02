const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        console.log("11111111111111111");
    } catch (error) {
        console.log(error.response.data);

    }
};

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();// this prevents the form from la-loading any other page.
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});