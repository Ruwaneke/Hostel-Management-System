import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        role: {
            type: String,
            enum: ["student", "staff", "admin"],
            required: [true, "Role is required"],
        },
        roomNumber: {
            type: String,
            default: null,
        },
        hostelBlock: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Auto-generate userId before saving
userSchema.pre("save", async function (next) {
    try {
        // Generate userId only if not already set
        if (!this.userId) {
            const prefix =
                this.role === "student"
                    ? "STU"
                    : this.role === "staff"
                    ? "STF"
                    : "ADM";
            const count = await mongoose
                .model("User")
                .countDocuments({ role: this.role });
            this.userId = `${prefix}${String(count + 1).padStart(3, "0")}`;
        }

        // Hash password only if modified
        if (this.isModified("password")) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }


    } catch (err) {
        next(err);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;