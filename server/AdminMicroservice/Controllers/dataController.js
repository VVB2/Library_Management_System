import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';
import issueModel from '../Models/issueModel.js';
import librarianModel from '../Models/librarianModel.js';
import studentModel from '../Models/studentModel.js';

export const issuedBooks = async (req, res) => {
    /**
     * Gets the data about all the issues books based on latest issue date
     * @return {json} data - Data about the issued books, the student who issued it
     */
    try {
        const data = [];
        const issuedBooksData = await issueModel.find({ "returned_on": null }).sort({ "issued_on": -1 });
        for (let issuedBook in issuedBooksData) {
            const student = await studentModel.find({ "_id": issuedBooksData[issuedBook].student_id });
            const book = await booksModel.find({ "accession_books_list": { "$all" : [issuedBooksData[issuedBook].accession_number] }});
            data.push({
                accession_number: issuedBooksData[issuedBook].accession_number,
                issued_on: issuedBooksData[issuedBook].issued_on,
                return_by: issuedBooksData[issuedBook].return_by,
                studentInfo: {
                    email: student[0].email,
                    name: student[0].name,
                    dept: student[0].dept,
                    year: student[0].year,
                    books_taken: student[0].books_taken,
                    fines_pending: student[0].fines_pending
                },
                bookInfo: {
                    title: book[0].book_detail[0].title,
                    isbn: book[0].book_detail[0].isbn,
                    image_url: book[0].book_detail[0].image_url,
                    author: book[0].book_detail[0].author,
                    publisher: book[0].book_detail[0].publisher,
                }
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const returnedBooks = async (req, res) => {
    /**
     * Gets the data about all the returned books based on latest returned date
     * @return {json} data - Data about the issued books, the student who issued it and the librarian who was it returned to
     */
    try {
        const data = [];
        const returnedBooksData = await issueModel.find({ "returned_on": { "$ne": null } }).sort({ "issued_on": -1 });
        for (let returnedBook in returnedBooksData) {
            const student = await studentModel.find({ "_id": returnedBooksData[returnedBook].student_id });
            const book = await booksModel.find({ "accession_books_list": { "$all" : [returnedBooksData[returnedBook].accession_number] }});
            const librarian = await librarianModel.find({ "_id": returnedBooksData[returnedBook].returned_to });
            data.push({
                accession_number: returnedBooksData[returnedBook].accession_number,
                issued_on: returnedBooksData[returnedBook].issued_on,
                returned_to: returnedBooksData[returnedBook].returned_to,
                returned_on: returnedBooksData[returnedBook].returned_on,
                studentInfo: {
                    email: student[0].email,
                    name: student[0].name,
                    dept: student[0].dept,
                    year: student[0].year,
                    books_taken: student[0].books_taken,
                    fines_pending: student[0].fines_pending
                },
                librarianInfo: {
                    email: librarian[0].email,
                    name: librarian[0].name,
                },
                bookInfo: {
                    title: book[0].book_detail[0].title,
                    isbn: book[0].book_detail[0].isbn,
                    image_url: book[0].book_detail[0].image_url,
                    author: book[0].book_detail[0].author,
                    publisher: book[0].book_detail[0].publisher,
                },
            })
        }
        return res.status(200).json(data);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}