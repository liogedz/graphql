const jwt = localStorage.getItem('jwt');
if (!jwt) {
    window.location.href = 'index.html';
}
const transact = [];
export async function fetchUserData() {
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
                        login
                        
                        attrs
                         transactions(
                            order_by: [{ type: asc }, { amount: asc }]
                            distinct_on: [type]
                            where: { type: { _like: "skill_%" }}){ 
                                type
                                amount
                            }
                            audits_aggregate{
                                aggregate{
                                    count
                                }
                            }
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
            return data.user[0];
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
        const header = document.createElement('h2');
        const login = document.createElement('p');
        const firstName = document.createElement('p');
        const lastName = document.createElement('p');
        const city = document.createElement('p');
        const state = document.createElement('p');

        header.innerText = 'Basic user info:';
        login.innerText = 'Login: ' + user.login || 'No user login available';
        firstName.innerText = 'Name: ' + user.attrs.firstName || 'No first name available';
        lastName.innerText = 'Last name: ' + user.attrs.lastName || 'No last name available';
        city.innerText = 'City: ' + user.attrs.addressCity || 'No user city available';
        state.innerText = 'Country: ' + user.attrs.addressCountry || 'No user state available';
        userBasic.classList.add('user-basic');
        userBasic.id = 'basic';

        userBasic.appendChild(header);
        userBasic.appendChild(login);
        userBasic.appendChild(firstName);
        userBasic.appendChild(lastName);
        userBasic.appendChild(city);
        userBasic.appendChild(state);

        document.body.appendChild(userBasic);
    } else {
        console.error('User data could not be retrieved or is empty');
    }
}

displayUserData();


