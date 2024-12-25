import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullName: {
            firstName: {
                type: String,
                
                minlength: [3, "First name must be atleast 3 characters long"]
            },
            lastName: {
                type: String,
                required: true,
                minlength: [3, "Last name must be atleast 3 characters long"]
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: [5, "E-mail must be atleast 5 characters long"]
        },
        password: {  // Needs to be encrypted
            type: String,
            required: true,
            trim: true,
            select: false
        },
        refreshToken: {
            type: String,
            select: false
        },
        tours: [
            {
                type: Schema.Types.ObjectId,
                ref: "Tour"
            }
        ],
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        }
    }, { timestamps: true }
);

// To encrypt pass
userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

// to compare the encrypted pass
userSchema.methods.isPasswordCorrect = async function(password, storedPassword) {
    return await bcrypt.compare(password, storedPassword); // Have to use this method beacuse we have set select:false in the password field in the model so this.password will not select the stored password of the user we have to manually send it into this function
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);