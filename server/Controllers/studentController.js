import logger from '../logger/logger.js';
import studentModel from '../Models/studentModel.js';

export const createSingleStudent = async (req, res) => { 
    /**
     * Creates
     * @param {int} accession_number - Accession number of the book
     * @param {ObjectId} book_id - Object Id of the book
     * @param {ObjectId} student_id - Student Id of the student
     * @return {json} message - Successful issue creation
     */
    try {
        insertUsers(req.body);
        logger.info('New user was created');
        res.status(200).json({ message: 'Account successfully created' });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const createBulkStudents = async (req, res) => { 
    try {
        console.log(req.body);
        res.status(200).json({'message': req});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

function insertUsers(user) {
    try {
        studentModel.create({
            email: user.email,
            password: user.password,
            name: user.name,
            address: user.address,
            phone_number: user.phone_number,
            dept: user.dept,
            year: user.year,
            profile_picture: user.profile_picture
        })
    } catch (error) {
        logger.error(error.message)
        console.log({ message: error.message });
    }
}