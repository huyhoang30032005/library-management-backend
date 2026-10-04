
const jwt = require("jsonwebtoken");

const {
    JWT_SECRET
} = require("../config/jwt");


function authMiddleware(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập"
            });
        }


        const parts =
            authHeader.split(" ");


        const tokenType =
            parts[0];

        const token =
            parts[1];


        if (
            tokenType !== "Bearer" ||
            !token
        ) {

            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            });
        }


        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        req.user =
            decoded;


        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
}


module.exports =
    authMiddleware;

