const express = require("express");
const cors = require("cors");

const bookRoutes =
    require("./routes/bookRoutes");

const borrowingRoutes = require("./routes/borrowingRoutes");

const borrowerRoutes = require("./routes/borrowerRoutes");

const userRoutes =
    require("./routes/userRoutes");

const errorHandler =
    require("./middlewares/errorHandler");


const app = express();


// ============================
// MIDDLEWARE
// ============================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ============================
// TEST API
// ============================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Library Management API is running"
    });

});


// ============================
// BOOK API
// ============================

app.use(
    "/api/books",
    bookRoutes
);

//-------------------------
//BORROWING API
//--------------------------
app.use(
    "/api/borrowings",
    borrowingRoutes
);

//--------------------------
//BORROWER API
//--------------------------
app.use(
    "/api/borrowers",
    borrowerRoutes
);

//----------------------------
//USER API
//----------------------------
app.use(
    "/api/users",
    userRoutes
);
// ============================
// 404
// ============================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });

});


// ============================
// ERROR HANDLER
// ============================

app.use(errorHandler);


module.exports = app;