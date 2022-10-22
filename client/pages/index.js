import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState, useEffect } from 'react';
import Link from "next/link";
import axios from 'axios';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Header from '../components/Header/Header';
import Content from '../components/Content/Content';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const changePage = (event, value) => {
    setPage(value);
    console.log(page);
    fetchData(page)
  };
  const fetchData = async (page) => {
    try {
      const data = await axios.get(`http://127.0.0.1:8000/getBooks?page=${page}`);
      setBooks(data.data);
      window.scrollTo({top:0, left:0, behavior:'smooth'});
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData(page);
  }, [page])
  
  return (
    <>
      <Header />
      <Content books={books} />
      <Stack spacing={2}>
        <Pagination
          onChange={changePage}
          count={10}
          page={page}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBack, next: ArrowForward }}
              {...item}
            />
          )}
        />
      </Stack>
    </>
  )
}
