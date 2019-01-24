import jwt_decode from "jwt-decode";
import {history} from '../common/History'
import {userConstants} from '../constants';

const ACCESS_TOKEN = "access_token";
export const login = (data) => dispatch => {
    console.log("action");
    loginRequest(data).then(response => {
        localStorage.setItem(ACCESS_TOKEN, response.access_token);
        const tokenData = jwt_decode(response.access_token);
        const userData = {
            role: tokenData.authorities,
            name: tokenData.user_name
        };
        dispatch({
            type: userConstants.LOGIN_SUCCESS,
            payload: userData
        });
        history.push('/barista');
    }).catch(error => {
        console.log(error);
    });
};

export function loginRequest(data) {
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('client:secret')
    });

    return fetch("/oauth/token?grant_type=password&username=" + data.username +
        "&password=" + data.password, {
        method: "POST",
        headers: headers
    }).then(response =>
        response.json().then(json => {
            if (response.ok) {
                return json;
            } else {
                return Promise.reject(json);
            }
        })
    );
}
