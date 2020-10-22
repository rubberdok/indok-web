import { useQuery } from "@apollo/client";
import { Documents } from "@interfaces/archives";
import { DOCUMENTS } from "@graphql/archive/queries";
import Link from "next/link";

const AllDocuments: React.FC = () => {
    const { loading, error, data } = useQuery<{ documents: Documents[] }>(DOCUMENTS);
    if (error) return <p>Error</p>;
    if (loading) return <p>Loading...</p>;
    return (
        <ul>
            {data &&
                data.documents.map((documents) => (
                    <li key={documents.id}>
                        <Link href={`/documents/${documents.id}/${documents.url}`}>{documents.title}</Link>
                        {documents}
                    </li>
                ))}
        </ul>
    );
};

console.log(AllDocuments);

export default AllDocuments;
