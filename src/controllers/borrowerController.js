const borrowerService =
    require("../services/borrowerService");


class BorrowerController {

    // ========================================
    // GET ALL BORROWERS
    // ========================================

    async getAllBorrowers(
        req,
        res,
        next
    ) {

        try {

            const borrowers =
                await borrowerService.getAllBorrowers();


            res.status(200).json({
                success: true,
                data: borrowers
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // ADD BORROWER
    // ========================================

    async createBorrower(
        req,
        res,
        next
    ) {

        try {

            const borrower =
                await borrowerService.createBorrower(
                    req.body
                );


            res.status(201).json({
                success: true,
                message: "Thêm người mượn thành công",
                data: borrower
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // UPDATE BORROWER
    // ========================================

    async updateBorrower(
        req,
        res,
        next
    ) {

        try {

            const { borrower_code } =
                req.params;


            const updatedBorrower =
                await borrowerService.updateBorrower(
                    borrower_code,
                    req.body
                );


            res.status(200).json({
                success: true,
                message: "Cập nhật người mượn thành công",
                data: updatedBorrower
            });

        } catch (error) {

            next(error);
        }
    }


    // ========================================
    // DELETE BORROWER
    // ========================================

    async deleteBorrower(
        req,
        res,
        next
    ) {

        try {

            const { borrower_code } =
                req.params;


            await borrowerService.deleteBorrower(
                borrower_code
            );


            res.status(200).json({
                success: true,
                message: "Xóa người mượn thành công"
            });

        } catch (error) {

            next(error);
        }
    }
}


module.exports =
    new BorrowerController();