const searchBar = document.getElementById('search-bar');
const search = document.getElementById('search');
const cross = document.getElementById('cross');
const catBox = document.querySelector('.cat-box');

searchBar.addEventListener('click', () => {
    search.style.left = "3%"
    searchBar.style.padding = "1vw 4vw"
    cross.style.left = "93%"
    cross.style.transform = "rotate(360deg)"
    catBox.style.height = "23vw"
    catBox.style.padding = "5vw 3vw 3vw 3vw"
})

cross.addEventListener('click', (event) => { 
    search.style.left = "93%"
    searchBar.style.padding = "1vw 2vw"
    cross.style.left = "100%"
    cross.style.transform = "rotate(0deg)"
    catBox.style.height = 0
    catBox.style.padding = "0 3vw"
})

// Backend Connecion

const dests = document.querySelector(".dests");

async function fetchData() {
    const response = await fetch("http://localhost:4000/api/destinations/get-all-destinations");

    const data = await response.json();
    
    if(data) {
        showAllDestinations(data.data);
    }
}

function showAllDestinations(destinations) {
    destinations.map((dest) => {
        const card = document.createElement("div");
        
        card.innerHTML = `
        <div class="dest box" key=${dest._id}>
            <div class="image"><img src=${dest.image}></div>
            <div class="dets">
                <h2>${dest.name}</h2>
                <p>${dest.description}</p>
            </div>
        </div>
        `

        dests.appendChild(card);
    })
}

fetchData();