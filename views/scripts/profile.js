const name = document.querySelector('#name');
const tourCount = document.querySelector('#tour-count');
const toursContainer = document.querySelector('#tours');

fetch('/api/user/current-user', {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(res => res.json())
.then(data => {
    const user = data.data;
    console.log(user)

    name.innerText = `${user.fullName.firstName} ${user.fullName.lastName}`;
    tourCount.innerText = user.tours.length;

    user.tours.forEach(t => {
        const tour = document.createElement('div');

        tour.innerHTML = `
        <div class="image-name">
            <div class="image"><img src=${t.destination.images[0]} alt=""></div>
            <h2>${t.destination.name}</h2>
        </div>
        <div class="price-date">
            <p>${t.destination.price}</p>
            <p>${t.destination.travelDate}</p>
        </div>
        `

        tour.classList.add('tour');

        toursContainer.appendChild(tour);
    });
})