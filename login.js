import { displayExperience } from "./experience.js";
import { displayUserData } from "./query.js";
import { backgroundGraph } from "./experience.js";


document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('logUsername').value;
    const password = document.getElementById('logPassword').value;
    const credentials = btoa(`${username}:${password}`);

    try {
        const response = await fetch('https://01.kood.tech/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Invalid credentials or server error');
        }
        const token = await response.json();
        console.log("Response token:", token);
        if (!token) {
            throw new Error('Token is missing in the response');
        }
        localStorage.setItem('jwt', token);

        // const confirmationMessage = `Token obtained: ${token}`;
        // document.getElementById('error-message').textContent = confirmationMessage;
        // document.getElementById('error-message').style.color = 'green';
        document.querySelector('.wrapper-login').style.display = 'none';
        document.querySelector('.graphs').style.display = 'block';
        displayExperience();
        displayUserData();
        backgroundGraph();

    } catch (error) {

        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').style.color = 'red';
    }
});

document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem('jwt');
    location.reload();
    document.querySelector('.wrapper-login').style.display = 'block';

})
