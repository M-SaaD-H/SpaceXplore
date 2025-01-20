const signupForm = document.querySelector('#signup-form form');
const loginForm = document.querySelector('#login-form form');
const image = document.querySelector('.image');

const loginAppearBtn = signupForm.querySelector('form p span');
const signupAppearBtn = loginForm.querySelector('form p span');

loginAppearBtn.addEventListener('click', () => {
    gsap.to(signupForm, {
        left: "100%"
    });

    gsap.to(loginForm, {
        right: 0,
        delay: 0.4
    });

    gsap.to(image, {
        left: "54.5%",
        delay: 0.2
    });
});

signupAppearBtn.addEventListener('click', () => {
    gsap.to(signupForm, {
        left: 0,
        delay: 0.4
    });

    gsap.to(loginForm, {
        right: "100%"
    });

    gsap.to(image, {
        left: "0.5%",
        delay: 0.2
    });
});