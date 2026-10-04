const borrowerRepository =
    require("../repositories/borrowerRepository");

const AppError =
    require("../utils/AppError");


class BorrowerService {

    // ========================================
    // GET ALL BORROWERS
    // ========================================

    async getAllBorrowers() {

        return await borrowerRepository.findAll();
    }


    // ========================================
    // ADD BORROWER
    // ========================================

    async createBorrower(data) {

        // Kiểm tra mã người mượn
        if (!data.borrower_code) {

            throw new AppError(
                "Mã người mượn là bắt buộc",
                400
            );
        }


        // Kiểm tra họ tên
        if (!data.full_name) {

            throw new AppError(
                "Họ tên người mượn là bắt buộc",
                400
            );
        }


        // Kiểm tra mã người mượn đã tồn tại chưa
        const existingBorrower =
            await borrowerRepository.findByCode(
                data.borrower_code
            );


        if (existingBorrower) {

            throw new AppError(
                "Mã người mượn đã tồn tại",
                400
            );
        }


        // Chuẩn bị dữ liệu người mượn
        const borrower = {

            borrower_code:
            data.borrower_code,

            full_name:
            data.full_name,

            email:
                data.email || null,

            phone:
                data.phone || null,

            address:
                data.address || null,

            date_of_birth:
                data.date_of_birth || null,

            gender:
                data.gender || null,

            status:
                data.status || "active"
        };


        // Thêm vào database
        const result =
            await borrowerRepository.create(
                borrower
            );


        // Lấy lại người mượn vừa thêm
        return await borrowerRepository.findById(
            result.insertId
        );
    }


    // ========================================
    // UPDATE BORROWER
    // ========================================

    async updateBorrower(
        borrowerCode,
        data
    ) {

        // Tìm người mượn cần sửa
        const borrower =
            await borrowerRepository.findByCode(
                borrowerCode
            );


        // Không tồn tại
        if (!borrower) {

            throw new AppError(
                "Không tìm thấy người mượn",
                404
            );
        }


        // Kiểm tra họ tên
        if (!data.full_name) {

            throw new AppError(
                "Họ tên người mượn là bắt buộc",
                400
            );
        }


        // Cập nhật database
        await borrowerRepository.updateByCode(
            borrowerCode,
            {
                full_name:
                data.full_name,

                email:
                    data.email || null,

                phone:
                    data.phone || null,

                address:
                    data.address || null,

                date_of_birth:
                    data.date_of_birth || null,

                gender:
                    data.gender || null,

                status:
                    data.status || "active"
            }
        );


        // Lấy lại dữ liệu sau khi cập nhật
        return await borrowerRepository.findByCode(
            borrowerCode
        );
    }


    // ========================================
    // DELETE BORROWER
    // ========================================

    async deleteBorrower(
        borrowerCode
    ) {

        // Kiểm tra người mượn có tồn tại không
        const borrower =
            await borrowerRepository.findByCode(
                borrowerCode
            );


        if (!borrower) {

            throw new AppError(
                "Không tìm thấy người mượn",
                404
            );
        }


        // Xóa người mượn
        await borrowerRepository.deleteByCode(
            borrowerCode
        );


        return true;
    }
}


module.exports =
    new BorrowerService();