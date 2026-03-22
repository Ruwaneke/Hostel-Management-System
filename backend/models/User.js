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
            select: false // Don't return password by default
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

// Auto-generate userId before saving
userSchema.pre('save', async function () {
    // Only generate userId if it's a new document
    if (!this.isNew || this.userId) return;

    const rolePrefix = this.role === 'admin' ? 'ADM' : 'USR';
    const count = await mongoose.model('User').countDocuments();
    this.userId = `${rolePrefix}${String(count + 1).padStart(4, '0')}`;
});

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) return;

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
