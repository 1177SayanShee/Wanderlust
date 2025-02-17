const mongoose = require("mongoose");
// const initData = require("./data.js");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// database function
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("database is connceted!");
    })
    .catch((err) => {
        console.log("Error ocurred!", err);
    });

const initDb = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map(el =>({...el, owner : '67a302cedbce13955e3e8cab'}));  // Here we need to use the extra '()' As JavaScript sees { ...el, owner: '...' } and assumes {} is a function block.
                                                                                            
    // We can also use this syntax 
    // initData.data = initData.data.map(el =>{
    //     return {...el, owner : '67a302cedbce13955e3e8cab'}
    // });

    await Listing.insertMany(initData.data);
    console.log("Data Inserted");
};

initDb();