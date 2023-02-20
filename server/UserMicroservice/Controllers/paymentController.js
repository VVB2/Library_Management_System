import jwt from 'jsonwebtoken';
import paymentModel from '../Models/paymentModel.js';

export const paymentInfo = async (req, res) => {
    const { id, exp } = jwt.decode(req.headers.authorization.split(' ')[1]);
    const payment_info = await paymentModel.find({ student_id: id });
    return res.status(201).json({ success: true, payment_info });
}