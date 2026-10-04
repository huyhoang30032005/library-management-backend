const express = require("express");

const userController =
    require("../controllers/userController");

const authMiddleware =
    require("../middlewares/authMiddleware");

const roleMiddleware =
    require("../middlewares/roleMiddleware");


const router = express.Router();
//----------------------------
//LOGIN
//------------------------------
router.post(
    "/login",
    userController.login );


// ========================================
// LẤY DANH SÁCH USER
// ========================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    userController.getAllUsers
);


// ========================================
// THÊM USER
// ========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    userController.createUser
);


// ========================================
// XEM CHI TIẾT
// ========================================

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    userController.getUserById
);


// ========================================
// CẬP NHẬT THÔNG TIN
// ========================================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    userController.updateUser
);


// ========================================
// KHÓA / MỞ KHÓA
// ========================================

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    userController.updateUserStatus
);


// ========================================
// ĐỔI MẬT KHẨU
// ========================================

router.patch(
    "/:id/password",
    authMiddleware,
    roleMiddleware("admin"),
    userController.changePassword
);


module.exports = router;