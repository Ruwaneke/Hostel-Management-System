import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters']
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'staff', 'student'],
            default: 'student'
        },
        roomNumber: {
            type: String,
            default: null
        },
        hostelBlock: {
            type: String,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Auto-generate userId before saving
userSchema.pre('save', async function (next) {
    if (!this.isNew || this.userId) return next();

    try {
        const rolePrefix = this.role === 'admin' ? 'ADM' : this.role === 'staff' ? 'STF' : 'STU';
        const count = await mongoose.model('User').countDocuments({ role: this.role });
        this.userId = `${rolePrefix}${String(count + 1).padStart(3, '0')}`;
    } catch (error) {
        next(error);
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
