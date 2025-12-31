import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Connected database!")
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}