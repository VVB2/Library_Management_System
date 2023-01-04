import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';
import issueModel from '../Models/issueModel.js';
import librarianModel from '../Models/librarianModel.js';
import studentModel from '../Models/studentModel.js';

export const getBooks = async (req, res) => {
    try {
        const books = await booksModel.find({});
        res.status(200).json({ books });
    } catch (error) {
        logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
        res.status(404).json({ message: error.message });
    }
}

export const issuedBooks = async (req, res) => {
    try {
        const data = [];
        const issuedBooksData = await issueModel.find({ "returned_on": null }).sort({ "issued_on": -1 });
        for (let issuedBook in issuedBooksData) {
            const student = await studentModel.find({ "_id": issuedBooksData[issuedBook].student_id });
            const book = await booksModel.find({ "_id": issuedBooksData[issuedBook].book_id });
            data.push({
                accession_number: issuedBooksData[issuedBook].accession_number,
                issued_on: issuedBooksData[issuedBook].issued_on,
                return_by: issuedBooksData[issuedBook].return_by,
                studentInfo: {
                    email: student[0].email,
                    name: student[0].name,
                    dept: student[0].dept,
                    class: student[0].class,
                },
                bookInfo: {
                    title: book[0].book_detail[0].title,
                    isbn: book[0].book_detail[0].isbn,
                    image_url: book[0].book_detail[0].image_url,
                }
            })
        }
        res.status(200).json(data);
    } catch (error) {
        logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
        res.status(404).json({ message: error.message });
    }
}

export const returnedBooks = async (req, res) => {
    try {
        const data = [];
        const returnedBooksData = await issueModel.find({ "returned_on": { "$ne": null } }).sort({ "issued_on": -1 });
        for (let returnedBook in returnedBooksData) {
            const student = await studentModel.find({ "_id": returnedBooksData[returnedBook].student_id });
            const book = await booksModel.find({ "_id": returnedBooksData[returnedBook].book_id });
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
                    class: student[0].class,
                },
                librarianInfo: {
                    email: librarian[0].email,
                    name: librarian[0].name,
                },
                bookInfo: {
                    title: book[0].book_detail[0].title,
                    isbn: book[0].book_detail[0].isbn,
                    image_url: book[0].book_detail[0].image_url,
                }
            })
        }
        res.status(200).json(data);
    } catch (error) {
        logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
        res.status(404).json({ message: error.message });
    }
}