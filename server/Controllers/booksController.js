import booksModel from '../Models/booksModel.js';

export const getBooks = async (req, res) => { 
    try {
        //get page number from query and skip using page_number*page_size
        const books = await booksModel.find().limit(10).skip(1*10);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}