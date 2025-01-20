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
		start: 'top 5%',
		end: '142%',
		pin: true,
	}
});