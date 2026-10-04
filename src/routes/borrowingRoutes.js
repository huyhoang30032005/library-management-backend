const express = require("express");

const borrowingController =
    require("../controllers/borrowingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();


// ==================================================
// GET BORROWING STATISTICS
// GET /api/borrowings/statistics
// ==================================================

router.get(
    "/statistics",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.getBorrowingStatistics
);


// ==================================================
// GET OVERDUE BOOKS
// GET /api/borrowings/overdue
// ==================================================

router.get(
    "/overdue",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.getOverdueBooks
);


// ==================================================
// GET RECENT BORROWINGS
// GET /api/borrowings/recent
// ==================================================

router.get(
    "/recent",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.getRecentBorrowings
);


// ==================================================
// GET ALL BORROWINGS
// GET /api/borrowings
// ==================================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.getAllBorrowings
);


// ==================================================
// CREATE BORROWING
// POST /api/borrowings
// ==================================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.createBorrowing
);


// ==================================================
// GET BORROWING BY ID
// GET /api/borrowings/:id
// ==================================================

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.getBorrowingById
);


// ==================================================
// RETURN BORROWING
// PUT /api/borrowings/:id/return
// ==================================================

router.put(
    "/:id/return",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.returnBorrowing
);


// ==================================================
// CANCEL BORROWING
// PUT /api/borrowings/:id/cancel
// ==================================================

router.put(
    "/:id/cancel",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowingController.cancelBorrowing
);


module.exports = router;