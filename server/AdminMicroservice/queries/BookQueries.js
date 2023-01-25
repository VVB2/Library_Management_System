import booksModel from "../Models/booksModel.js";

export const updateAvailableBook = async (param, process) => {
    const book = await booksModel.find({ "accession_books_list": { "$all" : [param.accession_number] }});
    await booksModel.updateOne({
        "_id": book[0]._id
    }, {
        [process]: { "available_books": param.accession_number }
    });
    return book;
}