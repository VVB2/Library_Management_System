import booksModel from '../Models/booksModel.js';

export const getBooks = async (req, res) => { 
    const noOfBooks = 20;
    const page = parseInt(req.query.page);
    try {
        //get page number from query and skip using page_number*page_size
        const books = await booksModel.find().limit(noOfBooks).skip((page-1)*noOfBooks);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getBooksTitles = async (req, res) => { 
    try {
        //get page number from query and skip using page_number*page_size
        const titles = await booksModel.distinct("book_detail.title");
        res.status(200).json(titles);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}