const borrowingService =
    require("../services/borrowingService");


class BorrowingController {


    // ==================================================
    // GET BORROWING STATISTICS
    // ==================================================

    async getBorrowingStatistics(
        req,
        res,
        next
    ) {
        try {

            const months =
                Number(req.query.months) || 6;

            const data =
                await borrowingService.getBorrowingStatistics(
                    months
                );

            res.status(200).json({
                success: true,
                data: data
            });

        } catch (error) {

            next(error);

        }
    }



    // ==================================================
    // GET OVERDUE BOOKS
    // ==================================================

    async getOverdueBooks(
        req,
        res,
        next
    ) {
        try {

            const data =
                await borrowingService.getOverdueBooks();

            res.status(200).json({
                success: true,
                data: data
            });

        } catch (error) {

            next(error);

        }
    }



    // ==================================================
    // GET RECENT BORROWINGS
    // ==================================================

    async getRecentBorrowings(
        req,
        res,
        next
    ) {
        try {

            const limit =
                Number(req.query.limit) || 5;

            const data =
                await borrowingService.getRecentBorrowings(
                    limit
                );

            res.status(200).json({
                success: true,
                data: data
            });

        } catch (error) {

            next(error);

        }
    }



    // ==================================================
    // GET ALL BORROWINGS
    // ==================================================

    async getAllBorrowings(
        req,
        res,
        next
    ) {
        try {

            const filters = {
                keyword: req.query.keyword || "",
                status: req.query.status || ""
            };

            const data =
                await borrowingService.getAllBorrowings(
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



    // ==================================================
    // GET BORROWING BY ID
    // ==================================================

    async getBorrowingById(
        req,
        res,
        next
    ) {
        try {

            const id =
                Number(req.params.id);

            const data =
                await borrowingService.getBorrowingById(
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



    // ==================================================
    // CREATE BORROWING
    // ==================================================

    async createBorrowing(
        req,
        res,
        next
    ) {
        try {

            const data =
                await borrowingService.createBorrowing(
                    req.body
                );

            res.status(201).json({
                success: true,
                message: "Lập phiếu mượn thành công",
                data: data
            });

        } catch (error) {

            next(error);

        }
    }



    // ==================================================
    // RETURN BORROWING
    // ==================================================

    async returnBorrowing(
        req,
        res,
        next
    ) {
        try {

            const id =
                Number(req.params.id);

            const data =
                await borrowingService.returnBorrowing(
                    id
                );

            res.status(200).json({
                success: true,
                message: "Trả sách thành công",
                data: data
            });

        } catch (error) {

            next(error);

        }
    }



    // ==================================================
    // CANCEL BORROWING
    // ==================================================

    async cancelBorrowing(
        req,
        res,
        next
    ) {
        try {

            const id =
                Number(req.params.id);

            const data =
                await borrowingService.cancelBorrowing(
                    id
                );

            res.status(200).json({
                success: true,
                message: "Hủy phiếu mượn thành công",
                data: data
            });

        } catch (error) {

            next(error);

        }
    }

}


module.exports = new BorrowingController();