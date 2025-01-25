import mongoose from "mongoose";

// Define the Friendship Schema
const friendshipSchema = new mongoose.Schema(
  {
    userId1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    userId2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed'], // Only confirmed friendships will be here
      default: 'confirmed',
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model for mutual friends
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will add 'createdAt' and 'updatedAt' fields automatically
  }
);

// Create the Friendship Model
const Friends = mongoose.model('Friendship', friendshipSchema);

export default Friends;
