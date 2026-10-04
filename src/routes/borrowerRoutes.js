const express = require("express");

const borrowerController =
    require("../controllers/borrowerController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


const router = express.Router();


// ========================================
// GET ALL BORROWERS
// GET /api/borrowers
// ========================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowerController.getAllBorrowers
);


// ========================================
// ADD BORROWER
// POST /api/borrowers
// ========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowerController.createBorrower
);


// ========================================
// UPDATE BORROWER
// PUT /api/borrowers/:borrower_code
// ========================================

router.put(
    "/:borrower_code",
    authMiddleware,
    roleMiddleware("admin", "librarian"),
    borrowerController.updateBorrower
);


// ========================================
// DELETE BORROWER
// DELETE /api/borrowers/:borrower_code
// ========================================

router.delete(
    "/:borrower_code",
    authMiddleware,
    roleMiddleware("admin"),
    borrowerController.deleteBorrower
);


module.exports = router;