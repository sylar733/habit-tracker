import mongoose from 'mongoose';

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectToDB;