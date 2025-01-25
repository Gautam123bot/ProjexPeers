import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true, // Ensure only one document per user
    required: true
  },
  messages: [
    {
      message: { type: String, required: true },
      status: { type: String, enum: ['unread', 'read'], default: 'unread' },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Ensure a single notification document per user
notificationSchema.index({ userId: 1 }, { unique: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
