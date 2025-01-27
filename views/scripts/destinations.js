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

searchBar.addEventListener('input', (e) => {
    const value = searchBar.value;

    if(value !== "") {
        catBox.style.height = 0
        catBox.style.padding = "0 3vw"
    }
})

cross.addEventListener('click', (event) => { 
    search.style.left = "93%"
    searchBar.style.padding = "1vw 2vw"
    cross.style.left = "100%"
    cross.style.transform = "rotate(0deg)"
    catBox.style.height = 0
    catBox.style.padding = "0 3vw"

    // Clear the input field

    searchBar.value = "";
})

// Backend Connecion

const dests = document.querySelector(".dests");

let allDestinations = [];

async function fetchData() {
    const response = await fetch("http://localhost:4000/api/destinations/get-all-destinations");

    const data = await response.json();
    
    if(data) {
        showAllDestinations(data.data);
    }
}

searchBar.addEventListener('input', (e) => {
    const value = e.target.value;

    allDestinations.forEach((d) => {
        const isVisible = d.name.toLowerCase().includes(value.toLowerCase());

        d.element?.classList.toggle("hide", !isVisible);
    })
})

function showAllDestinations(destinations) {
    allDestinations = destinations.map((dest) => {
        const card = document.createElement("div");
        
        card.innerHTML = `
        <a href="/destination/d/?id=${dest._id}">
            <div class="dest box" key=${dest._id}>
                <div class="image"><img src=${dest.images[0]}></div>
                <div class="dets">
                    <h2>${dest.name}</h2>
                    <p>${dest.tagline}</p>
                </div>
            </div>
        </a>
        `

        dests.appendChild(card);

        return {
            name: dest.name,
            tagline: dest.tagline,
            element: card
        }
    })
}

fetchData();