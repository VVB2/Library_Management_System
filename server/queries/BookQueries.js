import booksModel from "../Models/booksModel.js";

export const booksAutocomplete = async (param) => {
    return await booksModel.distinct(param);
}

export const booksSearchByParams = async (param) => {
    const queryObj = {};
    const usp = new URLSearchParams(param);
    for (const [key, value] of usp) {
        queryObj[`book_detail.${key}`] = value
    }
    return await booksModel.find(queryObj);
}

export const booksPagination = async (param, bookLimit) => {
    return await booksModel.find().limit(bookLimit).skip((param-1)*bookLimit);
}

export const isBookAvailable = async (param) => {
    return await booksModel.find({ "available_books": { "$all" : [param] }});
}

export const updateAvailableBook = async (param, process) => {
    const book = await booksModel.find({ "accession_books_list": { "$all" : [param.accession_number] }});
    await booksModel.updateOne({
        "_id": book[0]._id
    }, {
        [process]: { "available_books": param.accession_number }
    });
}