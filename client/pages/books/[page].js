import Content from "../../components/Content/Content";
import { useRouter } from 'next/router'

export default function Page() {
    const router = useRouter();
    const data = router.query;
    console.log(data);
    return (
        // <Content data={data} />
        <div>
            Hii
        </div>

    )
}