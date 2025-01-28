const loginBtn = document.getElementById('login-btn');
const profileBtn = document.getElementById('profile-btn');

const name = document.querySelector('.nav nav .logo h1');

const user = fetch('/api/user/current-user', {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(res => res.json())
.then(data => {
    const user = data.data;
    console.log('User =', user);

    name.innerText = "Hi, " + user.fullName.firstName;

    loginBtn.classList.add('hide');
    profileBtn.classList.remove('hide');

    return user;
});

// Logout

const dropdown = document.querySelector('.logout-dropdown');

profileBtn.addEventListener('click', () => {
    if(dropdown.classList.contains('hide')) {
        dropdown.classList.remove('hide');
    } else {
        dropdown.classList.add('hide');
    }
});

document.getElementById('profile-link').addEventListener('click', () => {
    window.location.href = '/profile';
});

document.getElementById('logout-btn').addEventListener('click', () => {
    fetch('/api/user/logout', {
        method: 'POST'
    })
    .then(res => {
        if(!res.ok) {
            res.json()
            .then(data => {
                alert(data.message);
            });
        }

        return res.json();
    })
    .then(data => {
        alert(data.message);
    })
})