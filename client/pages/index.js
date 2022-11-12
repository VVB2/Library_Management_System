import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';
import { Pagination, PaginationItem, Stack, CircularProgress, Backdrop } from '@mui/material';
import Header from '../components/Header/Header';
import Content from '../components/Content/Content';

export default function Home() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const changePage = (event, value) => {
    setPage(value);
    fetchData(value);
  };
  const fetchCountOFBooks = async () => {
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/getBooksCount`);
      setCount(Math.ceil(data.data.count/20) - 1)
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/getBooks?page=${page}`);
      setBooks(data.data);
      setLoading(false)
      window.scrollTo({top:0, left:0, behavior:'smooth'});
      console.log(books);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchCountOFBooks()
  }, []);
  useEffect(() => {
    fetchData(page);
  }, [page]);
  
  return (
    <>
      <Header />
      {loading ? <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> : (
        <>
          {/* <Content books={books} /> */}
          <Stack spacing={2}>
            <Link href={{
              href: `/books/page=${page}`,
              query: books
            }}>
              <Pagination
                shape='rounded'
                variant='outlined'
                onChange={changePage}
                count={count}
                page={page}
                size="large"
                boundaryCount={2}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                  />
                )}
                style={{
                  display: 'block',
                  margin: 'auto'
                }}
              />
            </Link>
          </Stack>
        </>
      )}
    </>
  )
}
