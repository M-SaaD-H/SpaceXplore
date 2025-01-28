const name = document.querySelector('#name');
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
        <button class="btn cancel-btn" style="background-color: #EB5160; color: white;">Cancel</button>
        `

        tour.classList.add('tour');
        tour.setAttribute('id', t._id);

        toursContainer.appendChild(tour);
    });
});

// Cancel Tour funtionality

const cancelBtns = document.querySelector('.container .tours-container .tours');
console.log(cancelBtns);

cancelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('clicked');
        const tour = btn.parentElement;
        const tourID =tour.getAttribute(id);

        fetch(`/api/tours/cancel-tour`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tourID })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "success") {
                alert('tour cancelled successfully');
                location.reload();
            }
        });
    });
})