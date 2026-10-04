const userService =
    require("../services/userService");


class UserController {

    // ========================================
    // GET /api/users
    // ========================================

    async getAllUsers(req, res, next) {

        try {

            const filters = {

                keyword:
                    req.query.keyword || "",

                role:
                    req.query.role || "",

                status:
                    req.query.status || ""
            };


            const data =
                await userService.getAllUsers(
                    filters
                );


            res.status(200).json({

                success: true,

                data: data
            });

        } catch (error) {

            next(error);
        }
    }


async login(req, res, next) {

    try {

        // ========================================
        // LẤY DỮ LIỆU
        // ========================================

        const {
            username,
            password
        } = req.body;


        // ========================================
        // GỌI SERVICE
        // ========================================

        const result =
            await userService.login(
                username,
                password
            );


        // ========================================
        // TRẢ KẾT QUẢ
        // ========================================

        res.status(200).json({

            success: true,

            message: "Đăng nhập thành công",

            data: result

        });


    } catch (error) {

        next(error);
    }
}





    // ========================================
    // GET /api/users/:id
    // ========================================

    async getUserById(req, res, next) {

        try {

            const id =
                Number(req.params.id);


            const data =
                await userService.getUserById(
                    id
                );


            res.status(200).json({

                success: true,

                data: data
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // POST /api/users
    // ========================================

    async createUser(req, res, next) {

        try {

            const data =
                await userService.createUser(
                    req.body
                );


            res.status(201).json({

                success: true,

                message:
                    "Tạo người dùng thành công",

                data: data
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // PUT /api/users/:id
    // ========================================

    async updateUser(req, res, next) {

        try {

            const id =
                Number(req.params.id);


            const data =
                await userService.updateUser(
                    id,
                    req.body
                );


            res.status(200).json({

                success: true,

                message:
                    "Cập nhật người dùng thành công",

                data: data
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // PATCH /api/users/:id/status
    // ========================================

    async updateUserStatus(
        req,
        res,
        next
    ) {

        try {

            const id =
                Number(req.params.id);


            const data =
                await userService.updateUserStatus(
                    id,
                    req.body.status
                );


            res.status(200).json({

                success: true,

                message:
                    data.status === "active"
                        ? "Mở khóa tài khoản thành công"
                        : "Khóa tài khoản thành công",

                data: data
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // PATCH /api/users/:id/password
    // ========================================

    async changePassword(
        req,
        res,
        next
    ) {

        try {

            const id =
                Number(req.params.id);


            const data =
                await userService.changePassword(
                    id,
                    req.body
                );


            res.status(200).json({

                success: true,

                message:
                    "Đổi mật khẩu thành công",

                data: data
            });

        } catch (error) {

            next(error);
        }
    }
}


module.exports = new UserController();