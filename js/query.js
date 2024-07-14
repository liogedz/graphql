export async function fetchUserData() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        throw new Error('JWT token not found');
    }
    try {
        const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                query: `
                    query {
                        user {
                        login
                        auditRatio
                        audits_aggregate (
                            where:{grade:{_neq:0}}){
                            aggregate {
                                count
                            }
                        }
                        attrs
                        transactions(
                            order_by: [{ type: asc }, { amount: asc }]
                            distinct_on: [type]
                            where: { type: { _like: "skill_%" }}
                        )   { 
                            type
                            amount
                        }
                        xps(
                            where: { path: { _nregex: "piscine-(go|js)" } }
                            order_by: { amount: asc }
                        )   {
                            amount
                            path
                            }
                        progresses(
                            order_by: { createdAt: asc }
                            where: { path: { _nregex: "piscine-(go|js)" } }
                        )   {
                            createdAt
                            path
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

export async function displayUserData() {
    const user = await fetchUserData();
    if (user) {

        const userWrapper = document.querySelector('.user');
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

        userBasic.appendChild(header);
        userBasic.appendChild(login);
        userBasic.appendChild(firstName);
        userBasic.appendChild(lastName);
        userBasic.appendChild(city);
        userBasic.appendChild(state);

        userWrapper.appendChild(userBasic);
    } else {
        console.error('User data could not be retrieved or is empty');
    }
}



