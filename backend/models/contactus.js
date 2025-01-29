import mongoose from 'mongoose';
const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact;
