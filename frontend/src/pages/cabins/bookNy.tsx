import { useRouter } from "next/router";

const BookPage = ({ query }: any) => {
    const router = useRouter();

    console.log(query);

    console.log("bookinger!: ", router.query);
    return <p>Book her</p>;
};

export default BookPage;
