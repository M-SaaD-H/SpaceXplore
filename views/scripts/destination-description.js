// For increasing and decreasing number of tickets
const inc = document.getElementById('inc');
const dec = document.getElementById('dec');

const input = document.getElementById('input');

inc.addEventListener("click", () => {
	input.value++;
});

dec.addEventListener("click", () => {
	input.value--;
	if (parseInt(input.value) < 1) {
		setTimeout(() => { input.value = 1 }, 250)
	}
});

input.addEventListener('input', function () {
	if (parseInt(input.value) < 1) {
		input.value = 1;
	}
});

// For pricing section
const pricingBox = document.querySelector('.pricing');

gsap.to(pricingBox, {
	scrollTrigger: {
		trigger: pricingBox,
		scroller: "body",
		start: 'top 15%',
		end: '98%',
		pin: true,
	}
});

// Backend Connection

const webTitle = document.querySelector('title');
const title = document.querySelector('.cont .images h1');
const mainImg = document.querySelector('.cont .images .images-cont .main-img');
const subImgs = document.querySelectorAll('.cont .images .images-cont .sub-imgs .img');
const price = document.querySelector('.cont .dets .pricing h1');
const travelDate = document.querySelector('.cont .dets .pricing h2');
const tickets = document.querySelector('.cont .dets .pricing li');
const detsCards = document.querySelectorAll('.cont .dets .left .box .dets-cards .dets-card');
const description = document.querySelector('.cont .dets .left .desc p');
const reviews = document.querySelectorAll('.cont .reviews .revs .rev');


const params = new URLSearchParams(window.location.search);
const destinationId = params.get('id');

if(destinationId) {
	fetch(`http://localhost:4000/api/destinations/d/${destinationId}`)
	.then(res => res.json())
	.then(fetchedData => {
		// Fill this data in frontend
		const data = fetchedData.data;
		console.log(data);

		webTitle.innerText = data.name;
		title.innerText = `${data.name} - ${data.tagline}`;
		mainImg.innerHTML = `<img src=${data.images[0]} alt=${data.name}>`
		subImgs.forEach((img, i) => {
			img.innerHTML = `<img src=${data.images[i+1]} alt=${data.name}>`
		})
		price.innerText = `${data.price} Cr`; 
		travelDate.innerText = data.travelDate; 
		tickets.innerText = `${data.availableTickets} tickets remaining`;
		detsCards[0].innerHTML = `
		<i class="fa-regular fa-clock"></i>
		<h2>${data.duration} Days</h2>
		<p>Duration</p>
		`;
		detsCards[2].innerHTML = `
		<i class="fa-solid fa-pen"></i>
		<h2>${data.reviews.length}</h2>
		<p>Reviews</p>
		`;
		description.innerText = data.description;
		reviews.forEach((r, i) => {
			r.innerHTML = `
			<div class="rev-name">
				<i class="fa-solid fa-user"></i>
				<p>Test</p>
			</div>
			<div class="rev-content">${data.reviews[i].content}</div>
			`
		})
	})
	.catch(err => {
		console.log(err)
	})
}