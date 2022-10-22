import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    books_details: Object,
    accession_books_list: Array,
    available_books: Array
},
    {collection: 'Books'}
);

const booksModel = mongoose.model("Books", booksSchema);

export default booksModel;