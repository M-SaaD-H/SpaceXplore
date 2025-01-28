const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

const subtotal = document.getElementById('subtotal');
const platformFee = document.getElementById('platform-fee');
const gst = document.getElementById('gst')
const totalAmount = document.getElementById('total-amount')

const image = document.getElementById('image')
const name = document.getElementById('name')
const travelDate = document.getElementById('travel-date')
const availableTickets = document.getElementById('available-tickets')
const duration = document.getElementById('duration')

const params = new URLSearchParams(window.location.search);
const destinationId = params.get('id');

if(destinationId) {
	fetch(`/api/destinations/d/${destinationId}`)
	.then(res => res.json())
	.then(fetchedData => {
		// Fill this data in frontend
		const data = fetchedData.data;
		console.log(data);

        // Fill Pricing Data

        subtotal.innerText = data.price * 10000000 + " Rs";
        platformFee.innerText = 100000 + " Rs";
        gst.innerText = 0.18 * data.price * 10000000 + " Rs"; // 18 % GST

        totalAmount.innerText = (data.price * 10000000) + 100000 + (0.18 * data.price * 10000000) + " Rs";

        // Fill the destination details

        name.innerText = data.name;
        image.innerHTML = `<img src=${data.images[0]} />`;
        travelDate.innerText = data.travelDate;
        availableTickets.innerText = data.availableTickets;
        duration.innerText = data.duration;
	})
	.catch(err => {
		console.log(err)
	})
}

// Proceeding to pay

const form = document.querySelector('.payment-dets form');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = emailField.value.trim();
    const password = passwordField.value.trim();

    const res = await fetch('/api/user/current-user', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(!res.ok) return;

    const data = await res.json();

    const user = data.data;

    if(user.email !== email) {
        alert('Email is incorrect');
        return;
    }

    if(password !== 'mypass' /* user.password */) { // The password stored in the db is hashed
        alert('Invalid password');
        return;
    }

    // Now proceed to pay -> Razorpay Integration
    alert('You can proceed to pay');
})