const db = require("../config/database");

class BorrowerRepository {

    // GET ALL BORROWER
    async findAll() {

        const sql = `
            SELECT
                br.id,
                br.borrower_code,
                br.full_name,
                br.email,
                br.phone,
                br.gender,
                br.address,
                br.status,
                br.date_of_birth,

                COUNT(
                        CASE
                            WHEN b.status = 'borrowing'
                                THEN 1
                            END
                ) AS borrowing_count,

                COUNT(
                        CASE
                            WHEN b.due_date < NOW()
                                AND b.return_date IS NULL
                                AND b.status != 'cancelled'
                        THEN 1
                            END
                ) AS overdue_count

            FROM borrowers br

                     LEFT JOIN borrowings b
                               ON br.id = b.borrower_id

            GROUP BY
                br.id,
                br.borrower_code,
                br.full_name,
                br.email,
                br.phone,
                br.created_at

            ORDER BY br.created_at DESC
        `;

        const [rows] = await db.execute(sql);

        return rows;
    }


    // GET BORROWER BY ID
    async findById(id) {

        const sql = `
            SELECT *
            FROM borrowers
            WHERE id = ?
        `;

        const [rows] = await db.execute(sql, [id]);

        return rows[0];
    }


    // GET BORROWER BY CODE
    async findByCode(borrowerCode) {

        const sql = `
            SELECT *
            FROM borrowers
            WHERE borrower_code = ?
        `;

        const [rows] = await db.execute(sql, [borrowerCode]);

        return rows[0];
    }


    // ADD BORROWER
    async create(borrower) {

        const sql = `
            INSERT INTO borrowers (
                borrower_code,
                full_name,
                email,
                phone,
                address,
                date_of_birth,
                gender,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            borrower.borrower_code,
            borrower.full_name,
            borrower.email,
            borrower.phone,
            borrower.address,
            borrower.date_of_birth,
            borrower.gender,
            borrower.status
        ]);

        return result;
    }


    // UPDATE BORROWER
    async updateByCode(borrowerCode, data) {

        const sql = `
            UPDATE borrowers
            SET
                full_name = ?,
                email = ?,
                phone = ?,
                address = ?,
                date_of_birth = ?,
                gender = ?,
                status = ?
            WHERE borrower_code = ?
        `;

        const [result] = await db.execute(sql, [
            data.full_name,
            data.email,
            data.phone,
            data.address,
            data.date_of_birth,
            data.gender,
            data.status,
            borrowerCode
        ]);

        return result;
    }


    // DELETE BORROWER
    async deleteByCode(borrowerCode) {

        const sql = `
            DELETE FROM borrowers
            WHERE borrower_code = ?
        `;

        const [result] = await db.execute(sql, [
            borrowerCode
        ]);

        return result;
    }
}


module.exports = new BorrowerRepository();