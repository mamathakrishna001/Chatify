import mongoose from "mongoose"

export const connectDB= async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to database`)
    }
    catch(error){
        console.log('Error:',error)
    }
};