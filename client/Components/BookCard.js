import Image from 'next/image';
import { Card, Col } from 'antd';

const { Meta } = Card;

export default function BookCard(book) {
    console.log(book.data.book_detail[0].image_url);
    return (
        <Col span={8}>
            <Card
                hoverable
                style={{ width: 240 }}
                cover={<Image alt="example" src={`${book.data.book_detail[0].image_url}`} width='240' height='240'/>}
            >
                <Meta title="Europe Street beat" description="www.instagram.com" />
            </Card>
        </Col>
    )
}