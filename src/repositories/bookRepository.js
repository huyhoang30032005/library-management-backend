const db =
    require("../config/database");


class BookRepository {


    // =========================
    // FIND ALL
    // =========================

        async findAll() {

            const sql = `
                SELECT *
                FROM books
                WHERE is_deleted = FALSE
                ORDER BY created_at DESC
            `;

            const [rows] =
                await db.execute(sql);

            return rows;
        }


    // =========================
    // FIND BY ID
    // =========================

    async findById(id) {

        const sql = `
            SELECT *
            FROM books
            WHERE id = ?
            AND is_deleted = FALSE
        `;

        const [rows] =
            await db.execute(
                sql,
                [id]
            );

        return rows[0];
    }


    // =========================
    // FIND BY BOOK CODE
    // =========================

    async findByBookCode(
        bookCode
    ) {

        const sql = `
            SELECT *
            FROM books
            WHERE book_code = ?
        `;

        const [rows] =
            await db.execute(
                sql,
                [bookCode]
            );

        return rows[0];
    }


    // =========================
    // FIND BY ISBN
    // =========================

    async findByISBN(isbn) {

        const sql = `
            SELECT *
            FROM books
            WHERE isbn = ?
        `;

        const [rows] =
            await db.execute(
                sql,
                [isbn]
            );

        return rows[0];
    }

    //COUNT BOOK

    async countBooks() {
        const sql = `
            SELECT COALESCE(SUM(quantity), 0) AS total
            FROM books
            WHERE is_deleted = FALSE
        `;

        const [rows] = await db.execute(sql);

        return rows[0].total;
    }


    //Count AvailableBooks
    async getAvailableBooksCount() {
        const sql = `
        SELECT SUM(available_quantity) AS totalAvailableBooks
        FROM books
        WHERE is_deleted = FALSE`;

        const [rows] = await db.execute(sql);
        return rows[0].totalAvailableBooks || 0;
    }

    //--------------------------
    //COUNT BOOKBORROWED
    //--------------------------
    async getBorrowedBooksCount() {
        const sql = `SELECT SUM(quantity - available_quantity) AS totalBorrowedBooks
        FROM books
        WHERE is_deleted = FALSE`;

        const [rows] = await db.execute(sql);
        return rows[0].totalBorrowedBooks || 0;
    }


    // COUNT OVER DUE BOOK
    async  getOverdueBooksCount(){
        const sql = ` SELECT COALESCE(
            SUM(bd.quantity - bd.returned_quantity),
            0
        ) AS totalOverdueBooks
        FROM borrowings b
        JOIN borrowing_details bd
            ON b.id = bd.borrowing_id
        WHERE b.due_date < NOW()
          AND b.return_date IS NULL
          AND b.status != 'cancelled'`;

        const [rows] = await db.execute(sql);
        return rows[0].totalOverdueBooks;
    }



    // =========================
    // CREATE
    // =========================

    async create(book) {

        const sql = `
            INSERT INTO books (
                book_code,
                title,
                isbn,
                author,
                publisher,
                publication_year,
                genre,
                language,
                price,
                quantity,
                available_quantity,
                shelf_location,
                description,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [

            book.book_code,
            book.title,
            book.isbn,
            book.author,
            book.publisher,
            book.publication_year,
            book.genre,
            book.language,
            book.price,
            book.quantity,
            book.available_quantity,
            book.shelf_location,
            book.description,
            book.status

        ];

        const [result] =
            await db.execute(
                sql,
                values
            );

        return result.insertId;
    }


    // =========================
    // UPDATE
    // =========================

    async update(
        id,
        book
    ) {

        const sql = `
            UPDATE books
            SET
                book_code = ?,
                title = ?,
                isbn = ?,
                author = ?,
                publisher = ?,
                publication_year = ?,
                genre = ?,
                language = ?,
                price = ?,
                quantity = ?,
                available_quantity = ?,
                shelf_location = ?,
                description = ?,
                status = ?
            WHERE id = ?
            AND is_deleted = FALSE
        `;

        const values = [

            book.book_code,
            book.title,
            book.isbn,
            book.author,
            book.publisher,
            book.publication_year,
            book.genre,
            book.language,
            book.price,
            book.quantity,
            book.available_quantity,
            book.shelf_location,
            book.description,
            book.status,
            id

        ];

        const [result] =
            await db.execute(
                sql,
                values
            );

        return result;
    }


    // =========================
    // SOFT DELETE
    // =========================

    async delete(id) {

        const sql = `
            UPDATE books
            SET is_deleted = TRUE
            WHERE id = ?
        `;

        const [result] =
            await db.execute(
                sql,
                [id]
            );

        return result;
    }

}


module.exports =
    new BookRepository();