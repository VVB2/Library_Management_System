import logger from "../logger/logger.js";
import issueModel from "../Models/issueModel.js";
import userModel from "../Models/userModel.js";

//issue book by the student
export const issueBook = async (req,res) => {
    try {
        const username = await userModel.find({ "_id": req.body.student_id }, { "name": 1 });
        issueModel.create({
            book_id: req.body.book_id,
            accession_number: req.body.accession_number,
            student_id: req.body.student_id,
        });
        logger.info(`Issue created by ${username[0].name}`);
        res.status(201).json({message: 'Issue successfully created'});
    } catch (error) {
        logger.error(error.message);
    }
}