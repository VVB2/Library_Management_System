import paymentModel from '../Models/paymentModel.js';
import studentModel from '../Models/studentModel.js';

/**
 * Payment information
 * @returns {json} data - Contains all data regarding payment
 */
export const paymentInfo = async (req, res) => {
    const payments = await paymentModel.find({});
    const data = [];
    for (const payment in payments) {
        const student = await studentModel.findById(payments[payment].student_id);
        data.push({
            payment_info: {
                payed_on: payments[payment].payed_on,
                invoice_link: payments[payment].invoice_link,
                amount: payments[payment].amount,
                transaction_id: payments[payment].transaction_id
            },
            student_info: {
                email: student.email,
                name: student.name,
                phone_number: student.phone_number,
                profile_picture: student.profile_picture
            }
        });
    }
    return res.status(200).json({ success: true, data });
}