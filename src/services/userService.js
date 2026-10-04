const userRepository =
    require("../repositories/userRepository");

const AppError =
    require("../utils/AppError");


const jwt = require("jsonwebtoken");

const {
    JWT_SECRET,
    JWT_EXPIRES_IN
} = require("../config/jwt");

class UserService {

    // ========================================
    // LẤY DANH SÁCH USER
    // ========================================

    async getAllUsers(filters) {

        return await userRepository.findAll(
            filters
        );
    }


    // ========================================
    // LẤY USER THEO ID
    // ========================================

    async getUserById(id) {

        if (
            !id ||
            Number.isNaN(Number(id))
        ) {

            throw new AppError(
                "ID người dùng không hợp lệ",
                400
            );
        }


        const user =
            await userRepository.findById(id);


        if (!user) {

            throw new AppError(
                "Không tìm thấy người dùng",
                404
            );
        }


        return user;
    }


    // ========================================
    // THÊM USER
    // ========================================

    async createUser(data) {

        const {
            full_name,
            username,
            email,
            phone,
            password,
            role,
            status
        } = data;


        // ========================================
        // KIỂM TRA HỌ TÊN
        // ========================================

        if (
            !full_name ||
            !full_name.trim()
        ) {

            throw new AppError(
                "Họ tên không được để trống",
                400
            );
        }


        // ========================================
        // KIỂM TRA USERNAME
        // ========================================

        if (
            !username ||
            !username.trim()
        ) {

            throw new AppError(
                "Tên đăng nhập không được để trống",
                400
            );
        }


        // ========================================
        // KIỂM TRA PASSWORD
        // ========================================

        if (!password) {

            throw new AppError(
                "Mật khẩu không được để trống",
                400
            );
        }


        if (password.length < 6) {

            throw new AppError(
                "Mật khẩu phải có ít nhất 6 ký tự",
                400
            );
        }


        // ========================================
        // KIỂM TRA ROLE
        // ========================================

        const allowedRoles = [
            "admin",
            "librarian"
        ];


        if (
            !allowedRoles.includes(role)
        ) {

            throw new AppError(
                "Vai trò không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA STATUS
        // ========================================

        const allowedStatuses = [
            "active",
            "inactive"
        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            throw new AppError(
                "Trạng thái không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA USERNAME TRÙNG
        // ========================================

        const existingUsername =
            await userRepository.findByUsername(
                username.trim()
            );


        if (existingUsername) {

            throw new AppError(
                "Tên đăng nhập đã tồn tại",
                409
            );
        }


        // ========================================
        // KIỂM TRA EMAIL TRÙNG
        // ========================================

        if (email && email.trim()) {

            const existingEmail =
                await userRepository.findByEmail(
                    email.trim()
                );


            if (existingEmail) {

                throw new AppError(
                    "Email đã tồn tại",
                    409
                );
            }
        }


        // ========================================
        // TẠO USER
        // ========================================

        const userId =
            await userRepository.create({

                full_name:
                    full_name.trim(),

                username:
                    username.trim(),

                email:
                    email && email.trim()
                        ? email.trim()
                        : null,

                phone:
                    phone && phone.trim()
                        ? phone.trim()
                        : null,

                password:
                password,

                role:
                role,

                status:
                status
            });


        // ========================================
        // TRẢ VỀ USER VỪA TẠO
        // ========================================

        return await this.getUserById(
            userId
        );
    }


    // ========================================
    // CẬP NHẬT USER
    // ========================================

    async updateUser(id, data) {

        // ========================================
        // KIỂM TRA ID
        // ========================================

        if (
            !id ||
            Number.isNaN(Number(id))
        ) {

            throw new AppError(
                "ID người dùng không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA USER CÓ TỒN TẠI
        // ========================================

        const currentUser =
            await userRepository.findById(id);


        if (!currentUser) {

            throw new AppError(
                "Không tìm thấy người dùng",
                404
            );
        }


        const {
            full_name,
            username,
            email,
            phone,
            role,
            status
        } = data;


        // ========================================
        // KIỂM TRA HỌ TÊN
        // ========================================

        if (
            !full_name ||
            !full_name.trim()
        ) {

            throw new AppError(
                "Họ tên không được để trống",
                400
            );
        }


        // ========================================
        // KIỂM TRA USERNAME
        // ========================================

        if (
            !username ||
            !username.trim()
        ) {

            throw new AppError(
                "Tên đăng nhập không được để trống",
                400
            );
        }


        // ========================================
        // KIỂM TRA ROLE
        // ========================================

        const allowedRoles = [
            "admin",
            "librarian"
        ];


        if (
            !allowedRoles.includes(role)
        ) {

            throw new AppError(
                "Vai trò không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA STATUS
        // ========================================

        const allowedStatuses = [
            "active",
            "inactive"
        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            throw new AppError(
                "Trạng thái không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA USERNAME TRÙNG
        // ========================================

        const existingUsername =
            await userRepository.findByUsername(
                username.trim()
            );


        if (
            existingUsername &&
            existingUsername.id !== Number(id)
        ) {

            throw new AppError(
                "Tên đăng nhập đã tồn tại",
                409
            );
        }


        // ========================================
        // KIỂM TRA EMAIL TRÙNG
        // ========================================

        if (email && email.trim()) {

            const existingEmail =
                await userRepository.findByEmail(
                    email.trim()
                );


            if (
                existingEmail &&
                existingEmail.id !== Number(id)
            ) {

                throw new AppError(
                    "Email đã tồn tại",
                    409
                );
            }
        }


        // ========================================
        // CẬP NHẬT USER
        // ========================================

        await userRepository.updateById(
            id,
            {

                full_name:
                    full_name.trim(),

                username:
                    username.trim(),

                email:
                    email && email.trim()
                        ? email.trim()
                        : null,

                phone:
                    phone && phone.trim()
                        ? phone.trim()
                        : null,

                role:
                role,

                status:
                status
            }
        );


        // ========================================
        // TRẢ VỀ USER SAU KHI CẬP NHẬT
        // ========================================

        return await this.getUserById(
            id
        );
    }


    // ========================================
    // KHÓA / MỞ KHÓA USER
    // ========================================

    async updateUserStatus(id, status) {

        // ========================================
        // KIỂM TRA ID
        // ========================================

        if (
            !id ||
            Number.isNaN(Number(id))
        ) {

            throw new AppError(
                "ID người dùng không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA USER
        // ========================================

        const user =
            await userRepository.findById(id);


        if (!user) {

            throw new AppError(
                "Không tìm thấy người dùng",
                404
            );
        }


        // ========================================
        // KIỂM TRA STATUS
        // ========================================

        if (
            status !== "active" &&
            status !== "inactive"
        ) {

            throw new AppError(
                "Trạng thái không hợp lệ",
                400
            );
        }


        // ========================================
        // CẬP NHẬT STATUS
        // ========================================

        await userRepository.updateStatus(
            id,
            status
        );


        // ========================================
        // TRẢ VỀ USER SAU KHI CẬP NHẬT
        // ========================================

        return await this.getUserById(
            id
        );
    }


    // ========================================
    // ĐỔI PASSWORD
    // ========================================

    async changePassword(id, data) {

        // ========================================
        // KIỂM TRA ID
        // ========================================

        if (
            !id ||
            Number.isNaN(Number(id))
        ) {

            throw new AppError(
                "ID người dùng không hợp lệ",
                400
            );
        }


        // ========================================
        // KIỂM TRA USER
        // ========================================

        const user =
            await userRepository.findByIdWithPassword(
                id
            );


        if (!user) {

            throw new AppError(
                "Không tìm thấy người dùng",
                404
            );
        }


        const {
            new_password,
            confirm_password
        } = data;


        // ========================================
        // KIỂM TRA PASSWORD
        // ========================================

        if (!new_password) {

            throw new AppError(
                "Mật khẩu mới không được để trống",
                400
            );
        }


        if (new_password.length < 6) {

            throw new AppError(
                "Mật khẩu mới phải có ít nhất 6 ký tự",
                400
            );
        }


        // ========================================
        // KIỂM TRA XÁC NHẬN PASSWORD
        // ========================================

        if (
            new_password !==
            confirm_password
        ) {

            throw new AppError(
                "Xác nhận mật khẩu không khớp",
                400
            );
        }


        // ========================================
        // CẬP NHẬT PASSWORD
        // ========================================

        await userRepository.updatePassword(
            id,
            new_password
        );


        // ========================================
        // TRẢ VỀ USER SAU KHI ĐỔI PASSWORD
        // ========================================

        return await this.getUserById(
            id
        );
    }


async login(username, password) {

    // ========================================
    // KIỂM TRA DỮ LIỆU
    // ========================================

    if (!username || !username.trim()) {

        throw new AppError(
            "Tên đăng nhập không được để trống",
            400
        );
    }


    if (!password) {

        throw new AppError(
            "Mật khẩu không được để trống",
            400
        );
    }


    // ========================================
    // TÌM USER
    // ========================================

    const user =
        await userRepository.findByUsername(
            username.trim()
        );


    // ========================================
    // KIỂM TRA USER
    // ========================================

    if (!user) {

        throw new AppError(
            "Tên đăng nhập hoặc mật khẩu không đúng",
            401
        );
    }


    // ========================================
    // KIỂM TRA PASSWORD
    // ========================================

    if (user.password !== password) {

        throw new AppError(
            "Tên đăng nhập hoặc mật khẩu không đúng",
            401
        );
    }


    // ========================================
    // KIỂM TRA TRẠNG THÁI
    // ========================================

    if (user.status !== "active") {

        throw new AppError(
            "Tài khoản đã bị khóa",
            403
        );
    }


    // ========================================
    // TẠO JWT
    // ========================================

    const token =
        jwt.sign(

            {
                id: user.id,
                username: user.username,
                role: user.role
            },

            JWT_SECRET,

            {
                expiresIn: JWT_EXPIRES_IN
            }
        );


    // ========================================
    // XÓA PASSWORD
    // ========================================

    delete user.password;


    // ========================================
    // TRẢ KẾT QUẢ
    // ========================================

    return {
        user: user,
        token: token
    };
}




}


module.exports = new UserService();