const borrowingRepository =
    require("../repositories/borrowingRepository");

const AppError =
    require("../utils/AppError");


class BorrowingService {


    // ==================================================
    // GET BORROWING STATISTICS
    // ==================================================

    async getBorrowingStatistics(months = 6) {

        return await borrowingRepository
            .getBorrowingStatistics(months);

    }



    // ==================================================
    // GET OVERDUE BOOKS
    // ==================================================

    async getOverdueBooks() {

        return await borrowingRepository
            .getOverdueBooks();

    }



    // ==================================================
    // GET RECENT BORROWINGS
    // ==================================================

    async getRecentBorrowings(limit = 5) {

        return await borrowingRepository
            .getRecentBorrowings(limit);

    }



    // ==================================================
    // GET ALL BORROWINGS
    // ==================================================

    async getAllBorrowings(filters = {}) {

        return await borrowingRepository
            .findAll(filters);

    }



    // ==================================================
    // GET BORROWING BY ID
    // ==================================================

    async getBorrowingById(id) {

        if (!id || Number.isNaN(Number(id))) {

            throw new AppError(
                "ID phiếu mượn không hợp lệ",
                400
            );

        }

        const borrowing =
            await borrowingRepository.findById(id);

        if (!borrowing) {

            throw new AppError(
                "Không tìm thấy phiếu mượn",
                404
            );

        }

        const details =
            await borrowingRepository
                .findDetailsByBorrowingId(id);

        return {
            borrowing: borrowing,
            details: details
        };

    }


    // ==================================================
    // CREATE BORROWING
    // ==================================================

    async createBorrowing(data) {

        // ----------------------------------------------
        // Kiểm tra dữ liệu cơ bản
        // ----------------------------------------------

        if (!data.borrowing_code) {

            throw new AppError(
                "Mã phiếu mượn là bắt buộc",
                400
            );

        }

        if (!data.borrower_id) {

            throw new AppError(
                "Người mượn là bắt buộc",
                400
            );

        }

        if (!data.user_id) {

            throw new AppError(
                "Người lập phiếu là bắt buộc",
                400
            );

        }

        if (!data.due_date) {

            throw new AppError(
                "Hạn trả là bắt buộc",
                400
            );

        }

        if (
            !Array.isArray(data.books) ||
            data.books.length === 0
        ) {

            throw new AppError(
                "Phiếu mượn phải có ít nhất một cuốn sách",
                400
            );

        }



        // ----------------------------------------------
        // Kiểm tra mã phiếu
        // ----------------------------------------------

        const exists =
            await borrowingRepository
                .existsBorrowingCode(
                    data.borrowing_code
                );

        if (exists) {

            throw new AppError(
                "Mã phiếu mượn đã tồn tại",
                400
            );

        }



        // ----------------------------------------------
        // Kiểm tra người mượn
        // ----------------------------------------------

        const borrower =
            await borrowingRepository
                .findBorrowerById(
                    data.borrower_id
                );

        if (!borrower) {

            throw new AppError(
                "Không tìm thấy người mượn",
                404
            );

        }

        if (borrower.status !== "active") {

            throw new AppError(
                "Người mượn đang không hoạt động",
                400
            );

        }



        // ----------------------------------------------
        // Kiểm tra sách
        // ----------------------------------------------

        const checkedBooks = [];

        for (const item of data.books) {

            if (!item.book_id) {

                throw new AppError(
                    "Book ID không hợp lệ",
                    400
                );

            }

            if (
                !Number.isInteger(
                    Number(item.quantity)
                ) ||
                Number(item.quantity) <= 0
            ) {

                throw new AppError(
                    "Số lượng sách không hợp lệ",
                    400
                );

            }


            const book =
                await borrowingRepository
                    .findBookById(
                        item.book_id
                    );


            if (!book) {

                throw new AppError(
                    `Không tìm thấy sách ID ${item.book_id}`,
                    404
                );

            }


            if (
                Number(book.available_quantity) <
                Number(item.quantity)
            ) {

                throw new AppError(
                    `Sách "${book.title}" không đủ số lượng`,
                    400
                );

            }


            checkedBooks.push({
                book_id: Number(item.book_id),
                quantity: Number(item.quantity)
            });

        }



        // ----------------------------------------------
        // Tạo phiếu
        // ----------------------------------------------

        const borrowing = {

            borrowing_code:
            data.borrowing_code,

            borrower_id:
                Number(data.borrower_id),

            user_id:
                Number(data.user_id),

            borrow_date:
                data.borrow_date || new Date(),

            due_date:
            data.due_date,

            note:
                data.note || null

        };


        const borrowingId =
            await borrowingRepository
                .createBorrowing(
                    borrowing,
                    checkedBooks
                );



        // ----------------------------------------------
        // Lấy lại phiếu vừa tạo
        // ----------------------------------------------

        return await this.getBorrowingById(
            borrowingId
        );

    }



    // ==================================================
    // RETURN BORROWING
    // ==================================================

    async returnBorrowing(id) {

        if (!id || Number.isNaN(Number(id))) {

            throw new AppError(
                "ID phiếu mượn không hợp lệ",
                400
            );

        }


        const borrowing =
            await borrowingRepository.findById(id);


        if (!borrowing) {

            throw new AppError(
                "Không tìm thấy phiếu mượn",
                404
            );

        }


        if (borrowing.status === "returned") {

            throw new AppError(
                "Phiếu này đã được trả",
                400
            );

        }


        if (borrowing.status === "cancelled") {

            throw new AppError(
                "Không thể trả sách của phiếu đã hủy",
                400
            );

        }


        await borrowingRepository
            .returnBorrowing(id);


        return await this.getBorrowingById(id);

    }



    // ==================================================
    // CANCEL BORROWING
    // ==================================================

    async cancelBorrowing(id) {

        if (!id || Number.isNaN(Number(id))) {

            throw new AppError(
                "ID phiếu mượn không hợp lệ",
                400
            );

        }


        const borrowing =
            await borrowingRepository.findById(id);


        if (!borrowing) {

            throw new AppError(
                "Không tìm thấy phiếu mượn",
                404
            );

        }


        if (borrowing.status === "returned") {

            throw new AppError(
                "Không thể hủy phiếu đã trả",
                400
            );

        }


        if (borrowing.status === "cancelled") {

            throw new AppError(
                "Phiếu này đã bị hủy",
                400
            );

        }


        await borrowingRepository
            .cancelBorrowing(id);


        return await this.getBorrowingById(id);

    }

}


module.exports = new BorrowingService();