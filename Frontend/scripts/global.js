const name = document.querySelector('.nav nav .logo h1');

fetch('http://localhost:4000/api/user/current-user', {
    method: "GET",
    credentials: 'include', // Important for cookie handling
    headers: {
        "Content-Type": "application/json"
    }
})
.then(res => res.json())
.then(data => {
    console.log(data)
    name.innerText = data.fullName.firstName;
})