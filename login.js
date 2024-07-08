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

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Invalid credentials or server error');
        }

        // Parse the response
        const data = await response.json();

        // Debug: Log the entire response data
        console.log("Response Data:", data);

        // Extract the token (assuming it's in `data.token`)
        const token = data;

        if (!token) {
            throw new Error('Token is missing in the response');
        }

        // Store the token in localStorage
        localStorage.setItem('jwt', token);

        // Display confirmation message
        const confirmationMessage = `Token obtained: ${token}`;
        document.getElementById('error-message').textContent = confirmationMessage;
        document.getElementById('error-message').style.color = 'green';
    } catch (error) {
        // Display error message
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').style.color = 'red';
    }
});
