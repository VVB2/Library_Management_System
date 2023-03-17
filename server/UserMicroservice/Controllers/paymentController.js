import jwt from 'jsonwebtoken';
import paymentModel from '../Models/paymentModel.js';

/**
 * 
 * @param {json} authorization - contains authorization token  
 * @returns {json} payment_info - contains all details about payment
 */
export const paymentInfo = async (req, res) => {
    const { id } = jwt.decode(req.headers.authorization.split(' ')[1]);
    const payment_info = await paymentModel.find({ student_id: id });
    return res.status(201).json({ success: true, payment_info });
}