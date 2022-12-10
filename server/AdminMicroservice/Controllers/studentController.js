import logger from '../logger/logger.js';
import studentModel from '../Models/studentModel.js';

export const createBulkStudents = async (req, res) => { 
    try {
        for(let data in req.body) {
            await insertUsers(req.body[data]);
            logger.info(`Successfully authorized student with email ${req.body[data].email}`);
        }
        res.status(200).json({'message': 'done'});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function insertUsers(user) {
    try {
        await studentModel.updateOne( {email: user.email}, { $set: { authorized: true }} );
    } catch (error) {
        logger.error(error.message)
        console.log({ message: error.message });
    }
}