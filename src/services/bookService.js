const bookRepository =
    require("../repositories/bookRepository");

const AppError =
    require("../utils/AppError");


class BookService {


    // =========================
    // GET ALL BOOKS
    // =========================

    async getAllBooks() {

        return await bookRepository.findAll();

    }


    //COUNT BOOK

    async countBooks() {
        return await bookRepository.countBooks();
    }


    //COUNT AVAILABLEBOOK
    async getAvailableBooksCount(){
        return await bookRepository.getAvailableBooksCount();
    }


    //COUNT BORROWEDBOOK
    async getBorrowedBooksCount(){
        return await bookRepository.getBorrowedBooksCount();
    }


    // COUNT OVER DUE BOOKS
    async getOverdueBooksCount(){
        return await bookRepository.getOverdueBooksCount();
    }



    // =========================
    // GET BOOK BY ID
    // =========================

    async getBookById(id) {

        const book =
            await bookRepository.findById(id);


        if (!book) {

            throw new AppError(
                "Không tìm thấy sách",
                404
            );

        }


        return book;
    }


    // =========================
    // CREATE BOOK
    // =========================

    async createBook(data) {


        if (!data.book_code) {

            throw new AppError(
                "Mã sách là bắt buộc",
                400
            );

        }


        if (!data.title) {

            throw new AppError(
                "Tên sách là bắt buộc",
                400
            );

        }


        if (!data.author) {

            throw new AppError(
                "Tác giả là bắt buộc",
                400
            );

        }


        // Kiểm tra mã sách

        const existingCode =
            await bookRepository.findByBookCode(
                data.book_code
            );


        if (existingCode) {

            throw new AppError(
                "Mã sách đã tồn tại",
                409
            );

        }


        // Kiểm tra ISBN

        if (data.isbn) {

            const existingISBN =
                await bookRepository.findByISBN(
                    data.isbn
                );


            if (existingISBN) {

                throw new AppError(
                    "ISBN đã tồn tại",
                    409
                );

            }

        }


        // Số lượng

        const quantity =
            Number(
                data.quantity || 0
            );


        if (quantity < 0) {

            throw new AppError(
                "Số lượng không hợp lệ",
                400
            );

        }


        const book = {

            book_code:
                data.book_code,

            title:
                data.title,

            isbn:
                data.isbn || null,

            author:
                data.author,

            publisher:
                data.publisher || null,

            publication_year:
                data.publication_year || null,

            genre:
                data.genre || null,

            language:
                data.language || null,

            price:
                Number(
                    data.price || 0
                ),

            quantity:

                quantity,

            available_quantity:

                quantity,

            shelf_location:
                data.shelf_location ||
                null,

            description:
                data.description ||
                null,

            status:

                quantity > 0
                    ? "available"
                    : "borrowed"
        };


        const id =
            await bookRepository.create(
                book
            );


        return await bookRepository.findById(
            id
        );
    }


    // =========================
    // UPDATE BOOK
    // =========================

    async updateBook(
        id,
        data
    ) {

        // 1. Lấy thông tin sách hiện tại
        const existingBook =
            await bookRepository.findById(id);

        if (!existingBook) {

            throw new AppError(
                "Không tìm thấy sách",
                404
            );

        }


        // 2. Lấy số lượng cũ
        const oldQuantity =
            Number(existingBook.quantity);

        const oldAvailableQuantity =
            Number(existingBook.available_quantity);


        // 3. Tính số sách đang được mượn
        const borrowedQuantity =
            oldQuantity -
            oldAvailableQuantity;


        // 4. Lấy quantity mới
        const quantity =
            Number(
                data.quantity ??
                existingBook.quantity
            );


        // 5. Kiểm tra quantity
        if (
            Number.isNaN(quantity) ||
            quantity < 0
        ) {

            throw new AppError(
                "Số lượng không hợp lệ",
                400
            );

        }


        // 6. Không được giảm số lượng xuống
        // thấp hơn số sách đang được mượn
        if (
            quantity <
            borrowedQuantity
        ) {

            throw new AppError(
                `Số lượng phải lớn hơn hoặc bằng ${borrowedQuantity} vì hiện đang có ${borrowedQuantity} cuốn được mượn`,
                400
            );

        }


        // 7. Tính lại số sách còn có thể cho mượn
        const availableQuantity =
            quantity -
            borrowedQuantity;


        // 8. Tạo dữ liệu sách mới
        const book = {

            book_code:
                data.book_code ??
                existingBook.book_code,

            title:
                data.title ??
                existingBook.title,

            isbn:
                data.isbn ??
                existingBook.isbn,

            author:
                data.author ??
                existingBook.author,

            publisher:
                data.publisher ??
                existingBook.publisher,

            publication_year:
                data.publication_year ??
                existingBook.publication_year,

            genre:
                data.genre ??
                existingBook.genre,

            language:
                data.language ??
                existingBook.language,

            price:
                Number(
                    data.price ??
                    existingBook.price
                ),

            quantity:
            quantity,

            available_quantity:
            availableQuantity,

            shelf_location:
                data.shelf_location ??
                existingBook.shelf_location,

            description:
                data.description ??
                existingBook.description,

            status:
                data.status ??
                existingBook.status
        };


        // 9. Cập nhật database
        await bookRepository.update(
            id,
            book
        );


        // 10. Lấy lại sách sau khi cập nhật
        return await bookRepository.findById(
            id
        );
    }

    // =========================
    // DELETE BOOK
    // =========================

    async deleteBook(id) {

        const existingBook =
            await bookRepository.findById(id);

        if (!existingBook) {

            throw new AppError(
                "Không tìm thấy sách",
                404
            );

        }


        if (existingBook.is_deleted) {

            throw new AppError(
                "Sách đã được xóa",
                400
            );

        }


        const borrowedQuantity =
            Number(existingBook.quantity) -
            Number(existingBook.available_quantity);


        if (borrowedQuantity > 0) {

            throw new AppError(
                "Không thể xóa sách đang được mượn",
                400
            );

        }


        const result =
            await bookRepository.delete(id);


        return result;
    }

}


module.exports =
    new BookService();