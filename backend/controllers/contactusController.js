import Contact from "../models/contactus.js";

export const createContactMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        return res.status(201).json({
            message: 'Contact message submitted successfully!',
            contact: newContact
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};