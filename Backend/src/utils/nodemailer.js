import nodemailer from "nodemailer"
import { google } from "googleapis"


const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.redireREDIRECT_URIctURI;
const refreshToken = process.env.REFRESH_TOKEN;
const sendersAddress = process.env.SENDERS_ADDRESS;


const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI);
oauth2Client.setCredentials({ refresh_token: refreshToken });


async function sendEmail(subject, emailContent, userEmail) {
    try {
        const accessToken = await oauth2Client.getAccessToken();
    
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: sendersAddress,
                clientId: clientID,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken.token
            }
        });
    
        const mailOptions = {
            from: `"SpaceXplore" <${sendersAddress}>`,
            to: userEmail,
            subject: subject,
            html: emailContent
        }
    
        const result = await transporter.sendMail(mailOptions);
        
        console.log("Email sent successfully!! Message ID:", result.messageId);
    } catch (error) {
        console.log("Error in sending mail", error);
    }
}

function sendWelcomeEmail(usersname, userEmail) {
    const subject = "Welcome to SpaceXplore - Your Space Journey Awaits"

    const emailContent = `
    <html>
        <body>
            <div>
                <p>Dear ${usersname},</p=>
                <p>We are pleased to welcome you to SpaceXplore. Your registration has been successfully completed, and you are now part of our exclusive community of space enthusiasts.</p>
                <p>At SpaceXplore, we offer an unparalleled opportunity to explore the wonders of space through carefully curated travel destinations. From the Moon to distant stars, your journey to the cosmos begins here.</p=>

                <p>Next Steps:</p>
                <ol>
                    <li>Discover Our Destinations: Explore a variety of destinations available for space tourism.</li>
                    <li>Book Your Experience: Choose your preferred destination and complete your booking seamlessly via your account.</li>
                    <li>Stay Updated: We will keep you informed with important updates, booking confirmations, and special offers via email.</li>                    </ol>
            </div>
        </body>
    </html>`;

    sendEmail(subject, emailContent, userEmail);
}

function sendBookingComfirmationEmail(usersname, tour, userEmail) {
    const subject = "Your Space Tourism Booking Confirmation";

    const emailContent = `
    <html>
        <body>
            <div>
                <p>Dear ${usersname},</p>
                <br>
                <p>Thank you for choosing SpaceXplore! We're thrilled to confirm your booking for an unforgettable journey among the stars. Below are the details of your booking:</p>
                <p>Booking Details:</p>
                <ul>
                    <li>Booking ID: ${tour._id}</li>
                    <li>Destination: ${tour.destination.name}</li>
                    <li>Departure Date: ${tour.destination.travelDate}</li>
                    <li>Total Amount: ${tour.destination.price}</li>
                </ul>
                <br>
                <p>Important Information:</p>
                <ul>
                    <li>Please ensure you arrive at the launch site at least 2 hours before the scheduled departure.</li>
                    <li>You can manage or cancel your booking through your account dashboard on our website.</li>
                    <li>For any assistance, feel free to contact our support team at support@spacexplore.com</li>
                </ul>
                <br>
                <p>We're Excited to Have You Aboard!</p>
                <p>Prepare for a journey beyond your imagination. Our team is committed to making your experience truly stellar.</p>
                <p>If you have any special requirements or questions, don’t hesitate to reach out.</p>
                <br>
                <br>
                <p>Safe travels,</p>
                <p>The SpaceXplore Team</p>
            </div>
        </body>
    </html>
    `

    sendEmail(subject, emailContent, userEmail);
}

function sendBookingCancellationEmail(usersname, tour, userEmail) {
    const subject = "Your Space Tourism Booking Has Been Cancelled";

    const emailContent = `
    <html>
    <body>
        <p>Dear ${usersname},</p>
        <p>We regret to inform you that your booking for the space tour has been cancelled. Below are the details of the cancelled booking:</p>
        <ul>
            <li>Booking ID: ${tour._id}</li>
            <li>Destination: ${tour.destination.name}</li>
            <li>Departure Date: ${tour.destination.travelDate}</li>
            <li>Amount Refund: ${tour.destination.price}</li>
        </ul>
        <br>
        <p>Refund Information</p>
        <p>If applicable, the refund of ${tour.destination.price} has been initiated to your original payment method. Refunds typically take 5-7 business days to process.</p>
        <p>If you believe this cancellation was made in error or wish to rebook your tour, please contact us at support@spacexplore.com</p>
        <br>
        <p>We sincerely apologize for any inconvenience this may have caused. We hope to assist you with your space exploration journey in the future.</p>
        <br>
        <br>
        <p>Best regards,</p>
        <p>The SpaceXplore Team</p>
    </body>
    </html>
    `

    sendEmail(subject, emailContent, userEmail);
}

function sendOTPEmail(usersname, OTP, userEmail) {
    const subject = "Your OTP for Login";

    const emailContent = `
    <html>
    <body>
        <p>Dear ${usersname},</p>
        <p>Your OTP for login is <strong>${OTP}</strong></p>
        <p>It is valid for 5 minutes</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <br>
        <p>Best Regards,</p>
        <p>SpaceXplore</p>
    </body>
    </html>
    `

    sendEmail(subject, emailContent, userEmail);
}

function sendResetPassOTPEmail(usersname, OTP, userEmail) {
    const subject = "Your One-Time Password (OTP) for Password Reset";

    const emailContent =`
    <html>
    <body>
        <p>Dear ${usersname},</p>
        <p>We've received a request to reset the password for your account. To proceed with the reset, please use the following One-Time Password (OTP):</p>
        <strong>${OTP}</strong>
        <p>Please enter this OTP on the password reset page to complete the process.</p>
        <strong>Important:</strong>
        <ul>
            <li>The OTP is valid for 5 minutes.</li>
            <li>If you did not request a password reset, please ignore this email. Your account will remain secure.</li>
        </ul>
        <p>If you need further assistance, feel free to contact our support team at support@spacexplore.com</p>
        <br>
        <br>
        <p>Best Regards</p>
        <p>The SpaceXplore Team</p>
    </body>
    </html>
    `

    sendEmail(subject, emailContent, userEmail);
}


export {
    sendWelcomeEmail,
    sendBookingComfirmationEmail,
    sendBookingCancellationEmail,
    sendOTPEmail,
    sendResetPassOTPEmail
}