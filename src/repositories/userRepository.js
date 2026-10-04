const db = require("../config/database");


class UserRepository {

    // ========================================
    // LẤY DANH SÁCH USER
    // ========================================

    async findAll(filters = {}) {

        let sql = `
            SELECT
                id,
                full_name,
                username,
                phone,
                email,
                role,
                status,
                created_at,
                updated_at
            FROM users
            WHERE 1 = 1
        `;

        const params = [];


        // TÌM KIẾM

        if (filters.keyword) {

            sql += `
                AND (
                    full_name LIKE ?
                    OR username LIKE ?
                    OR email LIKE ?
                )
            `;

            const keyword = `%${filters.keyword}%`;

            params.push(
                keyword,
                keyword,
                keyword
            );
        }


        // LỌC ROLE

        if (filters.role) {

            sql += `
                AND role = ?
            `;

            params.push(filters.role);
        }


        // LỌC STATUS

        if (filters.status) {

            sql += `
                AND status = ?
            `;

            params.push(filters.status);
        }


        // SẮP XẾP

        sql += `
            ORDER BY created_at DESC
        `;


        const [rows] = await db.execute(
            sql,
            params
        );

        return rows;
    }


    // ========================================
    // LẤY USER THEO ID
    // ========================================

    async findById(id) {

        const sql = `
            SELECT
                id,
                full_name,
                username,
                email,
                phone,
                role,
                status,
                created_at,
                updated_at
            FROM users
            WHERE id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [id]
        );

        return rows[0];
    }


    // ========================================
    // LẤY USER THEO ID
    // CÓ PASSWORD
    // ========================================

    async findByIdWithPassword(id) {

        const sql = `
            SELECT
                id,
                full_name,
                username,
                email,
                password,
                role,
                status,
                created_at,
                updated_at
            FROM users
            WHERE id = ?
        `;

        const [rows] = await db.execute(
            sql,
            [id]
        );

        return rows[0];
    }


    // ========================================
    // TÌM THEO USERNAME
    // ========================================


async findByUsername(username) {

    const [rows] =
        await db.query(
            `
    SELECT
    id,
    full_name,
    username,
    email,
    phone,
    password,
    role,
    status,
    created_at,
    updated_at
    FROM users
    WHERE username = ?
        LIMIT 1
            `,
            [username]
        );

    return rows[0];
}




    // ========================================
    // TÌM THEO EMAIL
    // ========================================

    async findByEmail(email) {

        const sql = `
            SELECT *
            FROM users
            WHERE email = ?
        `;

        const [rows] = await db.execute(
            sql,
            [email]
        );

        return rows[0];
    }


    // ========================================
    // TẠO USER
    // ========================================

    async create(user) {

        const sql = `
            INSERT INTO users (
                full_name,
                username,
                email,
                phone,
                password,
                role,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?,?)
        `;

        const [result] = await db.execute(
            sql,
            [
                user.full_name,
                user.username,
                user.email || null,
                user.phone,
                user.password,
                user.role,
                user.status
            ]
        );

        return result.insertId;
    }


    // ========================================
    // CẬP NHẬT USER
    // ========================================

    async updateById(id, user) {

        const sql = `
            UPDATE users
            SET
                full_name = ?,
                username = ?,
                email = ?,
                phone = ?,
                role = ?,
                status = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                user.full_name,
                user.username,
                user.email || null,
                user.phone,
                user.role,
                user.status,
                id
            ]
        );

        return result.affectedRows;
    }


    // ========================================
    // CẬP NHẬT STATUS
    // ========================================

    async updateStatus(id, status) {

        const sql = `
            UPDATE users
            SET status = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                status,
                id
            ]
        );

        return result.affectedRows;
    }


    // ========================================
    // ĐỔI PASSWORD
    // ========================================

    async updatePassword(id, password) {

        const sql = `
            UPDATE users
            SET password = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(
            sql,
            [
                password,
                id
            ]
        );

        return result.affectedRows;
    }
}


module.exports = new UserRepository();