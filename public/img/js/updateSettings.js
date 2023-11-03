import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'password'
                ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
                : 'http://127.0.0.1:3000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            // url: `http://127.0.0.1:3000/api/v1/users/${req.user.id}`,
            url,
            data
        });
        if (res.data.status === "Success") {
            showAlert('success', `${type.toUpperCase()} updated Successfully!`);
        }
        console.log("res");
        console.log(res);
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};