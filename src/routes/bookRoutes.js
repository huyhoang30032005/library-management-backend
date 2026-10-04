const express =
    require("express");

const bookController =
    require("../controllers/bookController");

const authMiddleware =
    require("../middlewares/authMiddleware");

const roleMiddleware =
    require("../middlewares/roleMiddleware");

const router =
    express.Router();


// GET /api/books

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.getAllBooks
);


//COUNT  /api/books/count
router.get(
    "/count",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.countBooks
);

//COUNT /api/books/available-count
router.get(
    "/available-count",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.getAvailableBooksCount
);

//COUNT /api/books/borrowed-count
router.get(
    "/borrowed-count",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.getBorrowedBooksCount
);

//COUNT /api/books/overdue-count
router.get(
    "/overdue-count",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.getOverdueBooksCount
);

// GET /api/books/:id

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.getBookById
);


// POST /api/books

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.createBook
);


// PUT /api/books/:id

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    bookController.updateBook
);


// DELETE /api/books/:id

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    bookController.deleteBook
);



module.exports = router;