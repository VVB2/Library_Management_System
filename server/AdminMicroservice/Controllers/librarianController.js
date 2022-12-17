import logger from '../logger/logger.js';
import librarianModel from '../Models/librarianModel.js';

export const createLibrarian = async (req, res) => { 
    /**
     * Creates
     * @param {email} email - Email of librarian
     * @param {password} password - Password of librarian
     * @param {name} name - Name of librarian
     * @param {address} address - Address of librarian
     * @param {phone_number} phone_number - Phone Number of librarian
     * @param {profile_picture} profile_picture - Profile picture of librarian
     * @return {json} message - Account successfully created
     */
    try {
        insertLibrarain(req.body);
        logger.info('New librarian was created');
        res.status(200).json({ message: 'Account successfully created' });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

function insertLibrarain(librarian) {
    try {
        librarianModel.create({
            email: librarian.email,
            password: librarian.password,
            name: librarian.name,
            address: librarian.address,
            phone_number: librarian.phone_number,
            dept: librarian.dept,
            year: librarian.year,
            profile_picture: librarian.profile_picture
        })
    } catch (error) {
        logger.error(error.message)
        console.log({ message: error.message });
    }
}