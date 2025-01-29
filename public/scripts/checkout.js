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
const destinationID = params.get('id');

if(destinationID) {
	fetch(`/api/destinations/d/${destinationID}`)
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
});

let user;

(async function() {
    const res = await fetch('/api/user/current-user', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(!res.ok) return;

    const data = await res.json();

    user = data.data;
})()



// Payment Gateway Integration

async function proceedToPay(e) {
    // e.preventDefault();
    console.log('Proceeding to pay');

    fetch('/api/tours/create-order', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ destinationID })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        createRazorpayOrder(data.data);
    })
    .catch(err => alert(err.message));
}

let orderID;

function createRazorpayOrder(order) {
    const options = {
        key: "rzp_test_oPvFtXGBmkeCZz",
        amount: order.amount,
        currency: order.currency,
        name: "SpaceXplore",
        description: "Embark on an unforgettable journey to your dream space destination!",
        // logo
        order_id: order.orderID,
        handler: async function (res) {
            // alert('Payment successful');
            console.log("res =", res);
            // window.location.href = '/';

            const verifyPayment = await fetch('/api/tours/verify-payment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    destinationID,
                    razorpayPaymentID: res.razorpay_payment_id,
                    razorpayOrderID: res.razorpay_order_id,
                    razorpaySignature: res.razorpay_signature
                })
            });

            const result = await verifyPayment.json();

            if(result.success) {
                alert('Tour booked successfully');
                window.location.href = '/';
            } else {
                alert('Payment verification failed');
                console.log(result);
            }
        },
        prefill: {
            name: `${user.fullName.firstName} ${user.fullName.lastName}`,
            email: user.email,
        },
        theme: {
            color: "#81D1B5"
        }
    }
    
    const rzp = new Razorpay(options);

    rzp.open();
}