import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            // url: `http://127.0.0.1:3000/api/v1/users/${req.user.id}`,
            url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        });
        if (res.data.status === "Success") {
            showAlert('success', 'Data Updated Successfully!');
        }
        console.log("res");
        console.log(res);
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};