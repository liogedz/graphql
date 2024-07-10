const jwt = localStorage.getItem('jwt');
if (!jwt) {
    window.location.href = 'index.html';
}

async function fetchUserData() {
    try {
        const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query {
                        user {
                            attrs
                        }
                    }
                `
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const { data } = await response.json();
        if (data && data.user && data.user.length > 0) {
            return data.user[0].attrs;
        } else {
            throw new Error('User data not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

async function displayUserData() {
    const user = await fetchUserData();

    if (user) {
        const userBasic = document.createElement('div');
        const userInfo = document.createElement('p');
        userInfo.innerText = user.firstName || 'No first name available'; // Add a fallback text in case firstName is missing
        userBasic.classList.add('user-basic');
        userBasic.id = 'basic';
        userBasic.appendChild(userInfo);
        document.body.appendChild(userBasic);
    } else {
        console.error('User data could not be retrieved or is empty');
    }
}

displayUserData();


