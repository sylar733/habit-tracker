import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true, 
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true, 
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);

export default User;
