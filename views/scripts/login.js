const signupForm = document.querySelector('#signup-form form');
const loginForm = document.querySelector('#login-form form');
const verifyOTP = document.querySelector('#verify-otp');
const verifyOTPForm = document.querySelector('#verify-otp form');
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
        left: "54%",
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
        left: "1%",
        delay: 0.2
    });
});

// Connecting to Backend

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = loginForm.querySelector('.email').value.trim();
    const password = loginForm.querySelector('.password').value.trim();

    const data = { email, password }

    try {
        const res = await fetch('/api/user/login', {
            method: "POST",
            // credentials: 'include',
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const resData = await res.json();

        console.log(resData);
        if (!res.ok) {
            alert(resData.message || 'Login failed');
            return;
        }

        window.location.href = '/'

    } catch (error) {
        console.log(error);
        // alert('An error occurred during login. Please try again.');
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = signupForm.querySelector('.first-name').value.trim();
    const lastName = signupForm.querySelector('.last-name').value.trim();
    const email = signupForm.querySelector('.email').value.trim();
    const password = signupForm.querySelector('.password').value.trim();
    const confirmPassword = signupForm.querySelector('.confirm-password').value.trim();

    if(password !== confirmPassword) {
        alert('Password and confirm password does not match');
        return;
    }

    const data = {
        fullName: {
            firstName,
            lastName
        },
        email,
        password
    }

    fetch('/api/user/register', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resData => {
        alert(resData.message);
    })
    .catch(err => {
        console.log(err.message);
    })

    verifyOTPAndCreateUser(data);
});

function verifyOTPAndCreateUser(data) {
    signupForm.style.display = 'none';
    verifyOTP.style.display = 'block';


    verifyOTPForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const OTP = verifyOTPForm.querySelector('input').value.trim();


        fetch('/api/user/verify-otp', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                OTP
            })
        })
        .then(res => res.json())
        .then(resData => {
            alert(resData.message);
            
            signupForm.style.display = 'block';
            verifyOTP.style.display = 'none';

            window.location.href = '/'
        })
        .catch(err => {
            alert(err.message);
        })
    })
}