import mongoose from "mongoose";

async function mongodbConnection(url: string) {

    console.log("Url");

    console.log(url);


    try {
        await mongoose.connect(url)
        console.log("MongoDb connection estalished");
    } catch (e) {
        Promise.reject(e)
    }
}

export { mongodbConnection }