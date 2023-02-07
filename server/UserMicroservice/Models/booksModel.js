import mongoose from "mongoose";

const book_detail = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    publishedYear: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    pages: {
        type: String,
        required: true
    },
    entry_date: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
})

const booksSchema = new mongoose.Schema({
    book_detail: [book_detail],
    accession_books_list: Array,
    available_books: Array
},
    {collection: 'Books'}
);

const booksModel = mongoose.model("Books", booksSchema);

export default booksModel;