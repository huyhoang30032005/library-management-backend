
const db = require("../config/database");


class BorrowingRepository {


    // ==================================================
    // GET BORROWING STATISTICS
    // ==================================================

    async getBorrowingStatistics(months = 6) {

        const sql = `
SELECT
YEAR(borrow_date) AS year,
    MONTH(borrow_date) AS month,
COUNT(*) AS total

FROM borrowings

WHERE borrow_date >= DATE_SUB(
    CURDATE(),
    INTERVAL ? MONTH
)

AND status != 'cancelled'

GROUP BY
YEAR(borrow_date),
    MONTH(borrow_date)

ORDER BY
YEAR(borrow_date),
    MONTH(borrow_date);
`;

        const [rows] =
            await db.execute(
                sql,
                [months]
            );

        return rows;
    }



    // ==================================================
    // GET OVERDUE BOOK
    // ==================================================

    async getOverdueBooks() {

        const sql = `
SELECT
b.borrowing_code,
    br.full_name AS borrower_name,
    bk.title AS book_title,
    b.due_date,
    bd.quantity,
    bd.returned_quantity

FROM borrowings b

JOIN borrowers br
ON b.borrower_id = br.id

JOIN borrowing_details bd
ON b.id = bd.borrowing_id

JOIN books bk
ON bd.book_id = bk.id

WHERE b.due_date < NOW()

AND b.return_date IS NULL

AND b.status != 'cancelled'

AND bd.quantity > bd.returned_quantity

ORDER BY b.due_date ASC
    `;

        const [rows] =
            await db.execute(sql);

        return rows;
    }



    // ==================================================
    // GET RECENT BORROWINGS
    // ==================================================

    async getRecentBorrowings(
        limit = 5
    ) {

        const sql = `
SELECT
b.borrowing_code,
    br.full_name AS borrower_name,
    bk.title AS book_title,
    b.borrow_date,
    b.due_date,
    b.status

FROM borrowings b

JOIN borrowers br
ON b.borrower_id = br.id

JOIN borrowing_details bd
ON b.id = bd.borrowing_id

JOIN books bk
ON bd.book_id = bk.id

WHERE b.status != 'cancelled'

ORDER BY b.borrow_date DESC

LIMIT ?
    `;

        const [rows] =
            await db.execute(
                sql,
                [limit]
            );

        return rows;
    }



    // ==================================================
    // LẤY DANH SÁCH PHIẾU MƯỢN
    // ==================================================

    async findAll(filters = {}) {

        let sql = `
    SELECT
b.id,
    b.borrowing_code,

    b.borrower_id,
    br.borrower_code,
    br.full_name AS borrower_name,

    b.user_id,

    b.borrow_date,
    b.due_date,
    b.return_date,

    CASE
WHEN b.status = 'borrowing'
AND b.due_date < NOW()
THEN 'overdue'

ELSE b.status
END AS status,

    b.note,

    COUNT(bd.id) AS book_count,

    GROUP_CONCAT(
        DISTINCT bk.title
ORDER BY bk.title
SEPARATOR ', '
) AS book_titles

FROM borrowings b

INNER JOIN borrowers br
ON b.borrower_id = br.id

LEFT JOIN borrowing_details bd
ON b.id = bd.borrowing_id

LEFT JOIN books bk
ON bd.book_id = bk.id

WHERE 1 = 1
    `;

        const params = [];


        // ==================================================
        // TÌM KIẾM
        // ==================================================

        if (filters.keyword) {

            sql += `
AND (
    b.borrowing_code LIKE ?
    OR br.borrower_code LIKE ?
    OR br.full_name LIKE ?

    OR EXISTS (
        SELECT 1

FROM borrowing_details bd2

INNER JOIN books bk2
ON bd2.book_id = bk2.id

WHERE bd2.borrowing_id = b.id

AND (
    bk2.title LIKE ?
    OR bk2.book_code LIKE ?
)
)
)
`;

            const keyword =
                `%${filters.keyword}%`;

            params.push(
                keyword,
                keyword,
                keyword,
                keyword,
                keyword
            );
        }



        // ==================================================
        // LỌC TRẠNG THÁI
        // ==================================================

        if (filters.status) {

            if (
                filters.status === "overdue"
            ) {

                sql += `
AND b.status = 'borrowing'
AND b.due_date < NOW()
    `;

            } else {

                sql += `
AND b.status = ?
    `;

                params.push(
                    filters.status
                );
            }
        }



        sql += `
    GROUP BY
b.id,
    b.borrowing_code,
    b.borrower_id,
    br.borrower_code,
    br.full_name,
    b.user_id,
    b.borrow_date,
    b.due_date,
    b.return_date,
    b.status,
    b.note

ORDER BY
b.created_at DESC
    `;


        const [rows] =
            await db.execute(
                sql,
                params
            );

        return rows;
    }



    // ==================================================
    // TÌM PHIẾU THEO ID
    // ==================================================

    async findById(id) {

        const sql = `
SELECT
b.*,

    br.borrower_code,
    br.full_name AS borrower_name,
    br.email AS borrower_email,
    br.phone AS borrower_phone

FROM borrowings b

INNER JOIN borrowers br
ON b.borrower_id = br.id

WHERE b.id = ?
    `;

        const [rows] =
            await db.execute(
                sql,
                [id]
            );

        return rows[0];
    }



    // ==================================================
    // TÌM PHIẾU THEO MÃ
    // ==================================================

    async findByCode(
        borrowingCode
    ) {

        const sql = `
    SELECT *
    FROM borrowings

WHERE borrowing_code = ?
    `;

        const [rows] =
            await db.execute(
                sql,
                [borrowingCode]
            );

        return rows[0];
    }



    // ==================================================
    // LẤY CHI TIẾT SÁCH TRONG PHIẾU
    // ==================================================

    async findDetailsByBorrowingId(
        borrowingId
    ) {

        const sql = `
    SELECT
bd.id,
    bd.borrowing_id,

    bd.book_id,

    bk.book_code,
    bk.title,
    bk.author,

    bd.quantity,
    bd.returned_quantity,

    (
        bd.quantity -
        bd.returned_quantity
    ) AS remaining_quantity

FROM borrowing_details bd

INNER JOIN books bk
ON bd.book_id = bk.id

WHERE bd.borrowing_id = ?

    ORDER BY bd.id ASC
    `;

        const [rows] =
            await db.execute(
                sql,
                [borrowingId]
            );

        return rows;
    }



    // ==================================================
    // TÌM NGƯỜI MƯỢN
    // ==================================================

    async findBorrowerById(
        borrowerId
    ) {

        const sql = `
SELECT *
FROM borrowers

WHERE id = ?
    `;

        const [rows] =
            await db.execute(
                sql,
                [borrowerId]
            );

        return rows[0];
    }



    // ==================================================
    // TÌM SÁCH
    // ==================================================

    async findBookById(
        bookId
    ) {

        const sql = `
    SELECT *
    FROM books

WHERE id = ?
    AND is_deleted = FALSE
        `;

        const [rows] =
            await db.execute(
                sql,
                [bookId]
            );

        return rows[0];
    }



    // ==================================================
    // KIỂM TRA MÃ PHIẾU ĐÃ TỒN TẠI
    // ==================================================

    async existsBorrowingCode(
        borrowingCode
    ) {

        const sql = `
SELECT id

FROM borrowings

WHERE borrowing_code = ?
    `;

        const [rows] =
            await db.execute(
                sql,
                [borrowingCode]
            );

        return rows.length > 0;
    }



    // ==================================================
    // TẠO PHIẾU MƯỢN
    // ==================================================

    async createBorrowing(
        borrowing,
        books
    ) {

        const connection =
            await db.getConnection();


        try {

            // Bắt đầu transaction

            await connection.beginTransaction();



            // ==================================================
            // 1. TẠO PHIẾU MƯỢN
            // ==================================================

            const borrowingSql = `
    INSERT INTO borrowings (
    borrowing_code,
    borrower_id,
    user_id,
    borrow_date,
    due_date,
    status,
    note
)

VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
    'borrowing',
        ?
)
    `;


            const [borrowingResult] =
                await connection.execute(
                    borrowingSql,
                    [
                        borrowing.borrowing_code,
                        borrowing.borrower_id,
                        borrowing.user_id,
                        borrowing.borrow_date,
                        borrowing.due_date,
                        borrowing.note
                    ]
                );


            const borrowingId =
                borrowingResult.insertId;



            // ==================================================
            // 2. THÊM TỪNG SÁCH
            // ==================================================

            for (
                const item of books
            ) {


                // ------------------------------------------
                // Khóa dòng sách
                // ------------------------------------------

                const bookSql = `
SELECT
id,
    quantity,
    available_quantity,
    is_deleted

FROM books

WHERE id = ?

    FOR UPDATE
        `;


                const [bookRows] =
                    await connection.execute(
                        bookSql,
                        [item.book_id]
                    );


                if (
                    bookRows.length === 0
                ) {

                    throw new Error(
                        `Không tìm thấy sách ID ${item.book_id}`
                    );
                }


                const book =
                    bookRows[0];


                // ------------------------------------------
                // Kiểm tra sách đã xóa
                // ------------------------------------------

                if (
                    book.is_deleted
                ) {

                    throw new Error(
                        `Sách ID ${item.book_id} đã bị xóa`
                    );
                }


                // ------------------------------------------
                // Kiểm tra số lượng
                // ------------------------------------------

                if (
                    Number(
                        book.available_quantity
                    )
                    <
                    Number(
                        item.quantity
                    )
                ) {

                    throw new Error(
                        `Sách ID ${item.book_id} không đủ số lượng`
                    );
                }



                // ------------------------------------------
                // Thêm borrowing_details
                // ------------------------------------------

                const detailSql = `
INSERT INTO borrowing_details (
    borrowing_id,
    book_id,
    quantity,
    returned_quantity
)

VALUES (
        ?,
        ?,
        ?,
    0
)
    `;


                await connection.execute(
                    detailSql,
                    [
                        borrowingId,
                        item.book_id,
                        item.quantity
                    ]
                );



                // ------------------------------------------
                // Cập nhật số lượng sách
                // ------------------------------------------

                const updateBookSql = `
UPDATE books

SET
available_quantity =
    available_quantity - ?,

    status =
        CASE
WHEN
available_quantity - ? <= 0
THEN 'borrowed'

ELSE 'available'
END

WHERE id = ?
    `;


                await connection.execute(
                    updateBookSql,
                    [
                        item.quantity,
                        item.quantity,
                        item.book_id
                    ]
                );
            }



            // ==================================================
            // 3. HOÀN TẤT
            // ==================================================

            await connection.commit();


            return borrowingId;


        } catch (error) {

            // Có lỗi → hoàn tác toàn bộ

            await connection.rollback();

            throw error;


        } finally {

            connection.release();
        }
    }



    // ==================================================
    // TRẢ SÁCH
    // ==================================================

    async returnBorrowing(
        borrowingId
    ) {

        const connection =
            await db.getConnection();


        try {

            await connection.beginTransaction();



            // ==================================================
            // 1. LẤY PHIẾU
            // ==================================================

            const [borrowingRows] =
                await connection.execute(
                    `
    SELECT *
    FROM borrowings

WHERE id = ?

    FOR UPDATE
        `,
                    [borrowingId]
                );


            if (
                borrowingRows.length === 0
            ) {

                throw new Error(
                    "Không tìm thấy phiếu mượn"
                );
            }


            const borrowing =
                borrowingRows[0];


            if (
                borrowing.status ===
                "returned"
            ) {

                throw new Error(
                    "Phiếu này đã được trả"
                );
            }


            if (
                borrowing.status ===
                "cancelled"
            ) {

                throw new Error(
                    "Phiếu này đã bị hủy"
                );
            }



            // ==================================================
            // 2. LẤY CHI TIẾT
            // ==================================================

            const [details] =
                await connection.execute(
                    `
SELECT
id,
    book_id,
    quantity,
    returned_quantity

FROM borrowing_details

WHERE borrowing_id = ?

    FOR UPDATE
        `,
                    [borrowingId]
                );



            // ==================================================
            // 3. TRẢ LẠI SÁCH
            // ==================================================

            for (
                const detail of details
            ) {

                const remaining =
                    Number(
                        detail.quantity
                    )
                    -
                    Number(
                        detail.returned_quantity
                    );


                if (
                    remaining <= 0
                ) {
                    continue;
                }



                // Cập nhật số lượng đã trả

                await connection.execute(
                    `
UPDATE borrowing_details

SET
returned_quantity =
    quantity

WHERE id = ?
    `,
                    [detail.id]
                );



                // Cộng lại số lượng có thể mượn

                await connection.execute(
                    `
    UPDATE books

SET
available_quantity =
    available_quantity + ?,

    status = 'available'

WHERE id = ?
    `,
                    [
                        remaining,
                        detail.book_id
                    ]
                );
            }



            // ==================================================
            // 4. CẬP NHẬT PHIẾU
            // ==================================================

            await connection.execute(
                `
    UPDATE borrowings

SET
return_date = NOW(),
    status = 'returned'

WHERE id = ?
    `,
                [borrowingId]
            );



            await connection.commit();

            return true;


        } catch (error) {

            await connection.rollback();

            throw error;


        } finally {

            connection.release();
        }
    }



    // ==================================================
    // HỦY PHIẾU
    // ==================================================

    async cancelBorrowing(
        borrowingId
    ) {

        const connection =
            await db.getConnection();


        try {

            await connection.beginTransaction();



            // ==================================================
            // 1. LẤY PHIẾU
            // ==================================================

            const [borrowingRows] =
                await connection.execute(
                    `
    SELECT *
    FROM borrowings

WHERE id = ?

    FOR UPDATE
        `,
                    [borrowingId]
                );


            if (
                borrowingRows.length === 0
            ) {

                throw new Error(
                    "Không tìm thấy phiếu mượn"
                );
            }


            const borrowing =
                borrowingRows[0];


            if (
                borrowing.status ===
                "returned"
            ) {

                throw new Error(
                    "Không thể hủy phiếu đã trả"
                );
            }


            if (
                borrowing.status ===
                "cancelled"
            ) {

                throw new Error(
                    "Phiếu này đã bị hủy"
                );
            }



            // ==================================================
            // 2. LẤY CHI TIẾT
            // ==================================================

            const [details] =
                await connection.execute(
                    `
SELECT
id,
    book_id,
    quantity,
    returned_quantity

FROM borrowing_details

WHERE borrowing_id = ?

    FOR UPDATE
        `,
                    [borrowingId]
                );



            // ==================================================
            // 3. HOÀN LẠI SỐ LƯỢNG SÁCH
            // ==================================================

            for (
                const detail of details
            ) {

                const remaining =
                    Number(
                        detail.quantity
                    )
                    -
                    Number(
                        detail.returned_quantity
                    );


                if (
                    remaining <= 0
                ) {
                    continue;
                }


                await connection.execute(
                    `
UPDATE books

SET
available_quantity =
    available_quantity + ?,

    status = 'available'

WHERE id = ?
    `,
                    [
                        remaining,
                        detail.book_id
                    ]
                );
            }



            // ==================================================
            // 4. CẬP NHẬT TRẠNG THÁI PHIẾU
            // ==================================================

            await connection.execute(
                `
    UPDATE borrowings

SET
status = 'cancelled'

WHERE id = ?
    `,
                [borrowingId]
            );



            await connection.commit();

            return true;


        } catch (error) {

            await connection.rollback();

            throw error;


        } finally {

            connection.release();
        }
    }



    // ==================================================
    // CẬP NHẬT PHIẾU QUÁ HẠN
    // ==================================================

    async updateOverdueStatuses() {

        const sql = `
    UPDATE borrowings

SET
status = 'overdue'

WHERE status = 'borrowing'

AND due_date < NOW()
    `;


        const [result] =
            await db.execute(sql);


        return result;
    }

}


module.exports =
    new BorrowingRepository();

