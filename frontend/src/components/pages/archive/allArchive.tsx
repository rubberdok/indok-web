/* eslint-disable prettier/prettier */
import { useQuery } from "@apollo/client";
import { DOCUMENTS } from "@graphql/archive/queries";
import { ArchivedDocument } from "@interfaces/archive";

const AllArchive = () => {
    const { loading, error, data } = useQuery(DOCUMENTS);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;
    console.log(data);
    console.log("hei");
    return data.allArchives.map((document: ArchivedDocument) => (
        <div key={document.id}>
            <img src={document.thumbnail} alt="" />
            <p>
                {document.id}: {document.title} - {document.date}- {document.typeDoc}- {document.url}-{" "}
            </p>
        </div>
    ));
};

export default AllArchive;
