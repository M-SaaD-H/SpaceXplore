const profileName = document.querySelector('#name');
const tourCount = document.querySelector('#tour-count');
const toursContainer = document.querySelector('.tours');

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

    profileName.innerText = `${user.fullName.firstName} ${user.fullName.lastName}`;
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
        <button class="btn cancel-btn" style="background-color: #EB5160; color: white;">Cancel</button>
        `

        tour.classList.add('tour');
        tour.setAttribute('id', t._id);

        const cancelButton = tour.querySelector('.cancel-btn');
        cancelButton.addEventListener('click', function() {
            cancelTour(t._id);
        });

        toursContainer.appendChild(tour);
    });
});

// Cancel Tour funtionality

function cancelTour(tourID) {
    fetch(`/api/tours/cancel-tour`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tourID })
    })
    .then(res => res.json())
    .then(data => {
        if(data.statusCode !== 200) {
            alert(data.message);
            return;
        }

        alert('tour cancelled successfully');
        location.reload();
    });
}