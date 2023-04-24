import issueModel from "../Models/issueModel.js";
import booksModel from "../Models/booksModel.js";
import librarianModel from "../Models/librarianModel.js";

export const createIssueAndBookReturnNotification = async (param) => {
    await issueModel.create({
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
}

export const getInfo = async (param) => {
    const data = [];
    const issueData = await issueModel.find({
        student_id: param.student_id    
    });
    for(const issue in issueData) {
        const bookData = await booksModel.find({ "accession_books_list": { "$all" : [issueData[issue].accession_number] }}, { accession_books_list: 0, available_books: 0, _id: 0 });
        const librarianData = await librarianModel.findById( issueData[issue].returned_to, { _id: 0 } );
        data.push({
            issueData: issueData[issue],
            bookData,
            librarianData
        })
    }
    return data
}