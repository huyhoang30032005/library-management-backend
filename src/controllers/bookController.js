const bookService =
    require("../services/bookService");


class BookController {


    // =========================
    // GET ALL
    // =========================

    async getAllBooks(
        req,
        res,
        next
    ) {

        try {

            const books =
                await bookService.getAllBooks();


            res.status(200).json({

                success: true,

                data: books

            });

        } catch (error) {

            next(error);

        }
    }


    // =========================
    // GET BY ID
    // =========================

    async getBookById(
        req,
        res,
        next
    ) {

        try {

            const book =
                await bookService.getBookById(
                    req.params.id
                );


            res.status(200).json({

                success: true,

                data: book

            });

        } catch (error) {

            next(error);

        }
    }


    //COUNT AVAILABLEBOOK(Số sách có sẵn)
    async getAvailableBooksCount(
        req,
        res,
        next
    ){
        try {
            const totalAvailableBooks = await bookService.getAvailableBooksCount();

            res.json({
                success: true,
                data: totalAvailableBooks
            });
        }catch (error) {
            next(error);
        }
    }


    //------------------
    //COUNT BOOK
    //------------------
    async countBooks(
        req,
        res,
        next
    ){
        try {
            const total=
                await bookService.countBooks();

            res.status(200).json({
                success: true,

                data:{
                    total
                }
            });
        }catch(error){
            next(error);
        }
    }


    //COUNT BORROWEDBOOK
    async getBorrowedBooksCount(
        req,
        res,
        next
    ){
        try{
            const totalBorrowedBooks = await bookService.getBorrowedBooksCount();

            res.status(200).json({
                success: true,
                data: totalBorrowedBooks
            });
        }catch (error) {
            next(error);
        }
    }


    //COUNT OVER DUE BOOK
    async getOverdueBooksCount(
        req,
        res,
        next
    ){
        try{
            const totalOverdueBooks = await bookService.getOverdueBooksCount();

            res.status(200).json({
                success: true,
                data: totalOverdueBooks
            });
        }catch (error) {
            next(error);
        }
    }



    // =========================
    // CREATE
    // =========================

    async createBook(
        req,
        res,
        next
    ) {

        try {

            const book =
                await bookService.createBook(
                    req.body
                );


            res.status(201).json({

                success: true,

                message:
                    "Thêm sách thành công",

                data: book

            });

        } catch (error) {

            next(error);

        }
    }


    // =========================
    // UPDATE
    // =========================

    async updateBook(req, res, next) {

        try {

            // Lấy id từ URL
            const id =
                Number(req.params.id);


            // Kiểm tra id
            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message: "ID sách không hợp lệ"
                });

            }


            // Dữ liệu gửi từ frontend
            const data =
                req.body;


            // Gọi service
            const book =
                await bookService.updateBook(
                    id,
                    data
                );


            // Trả kết quả về frontend
            res.status(200).json({

                success: true,

                message:
                    "Cập nhật sách thành công",

                data: book

            });

        } catch (error) {

            next(error);

        }

    }


    // =========================
    // DELETE
    // =========================

    async deleteBook(req, res, next) {

        try {

            const id =
                Number(req.params.id);


            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "ID sách không hợp lệ"

                });

            }


            await bookService.deleteBook(id);


            res.status(200).json({

                success: true,

                message:
                    "Xóa sách thành công"

            });

        } catch (error) {

            next(error);

        }

    }

}


module.exports =
    new BookController();