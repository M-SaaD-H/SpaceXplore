import nodemailer from "nodemailer"
import { google } from "googleapis"


const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = process.env.redireREDIRECT_URIctURI;
const refreshToken = process.env.REFRESH_TOKEN;
const sendersAddress = process.env.SENDERS_ADDRESS;


const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI);
oauth2Client.setCredentials({ refresh_token: refreshToken });


async function sendWelcomeEmail(usersname, userEmail) {
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

        const htmlContent = `
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
                        <li>Stay Updated: We will keep you informed with important updates, booking confirmations, and special offers via email.</li>
                    </ol>
                </div>
            </body>
        </html>`;
    
        const mailOptions = {
            from: `"SpaceXplore" <${sendersAddress}>`,
            to: userEmail,
            subject: "Welcome to SpaceXplore - Your Space Journey Awaits",
            html: htmlContent
        }
    
        const result = await transporter.sendMail(mailOptions);
        
        console.log("Welcome email sent successfully!! Message ID:", result.messageId);
    } catch (error) {
        console.log("Error in sending mail", error);
    }
}


export {
    sendWelcomeEmail
}