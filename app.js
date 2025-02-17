// if(process.env.NODE_ENV != "production"){
// require('dotenv').config();
   
// }

require('dotenv').config();

// console.log(process.env.SECRET)


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listingRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const userRouter = require("./routes/userRouter.js");



const app = express();  // app instance

const port = 3000;  // port

const dbUrl = process.env.MONGO_ATLAS_URL;  // Database URL


// Mongo Session Store
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
    secret: process.env.SESSION_SECRET,
    },
    touchAfter : 24* 3600
});

store.on("error", ()=>{
    console.log("Eroor in  MongoDB Session");
})

// Session Options
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expects a Date object, not a timestamp.
        maxAge: 7 * 24 * 60 * 60 * 1000, // time stamp (in miliseconds)
        httpOnly: true
    }
};

// Sets
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Uses
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.MAP_TOKEN= process.env.MAP_TOKEN;


    next();
});


// // Root
// app.get("/", (req, res) => {
//     res.send("This is Root");
//     // console.log("This is root");
// });


// Listings Router ------->
app.use("/listings", listingRouter);


// Reviews Router ------->
app.use("/listings/:id/reviews", reviewRouter);

// User Router ----------->
app.use("/", userRouter);


// Rest of Routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing went Wrong!!" } = err;

    res.status(statusCode).render("listings/error.ejs", { err });

})



// database function
async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("database is connceted!");
    })
    .catch((err) => {
        console.log("Error ocurred!", err);
    })



app.listen(port, () => {
    console.log("server is listening!!");
});