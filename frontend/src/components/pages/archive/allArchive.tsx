/* eslint-disable prettier/prettier */
import { useQuery } from "@apollo/client";
import { GET_ARCHIVEDDOCUMENTS } from "@graphql/archive/queries";
import { ArchivedDocument } from "@interfaces/archive";

const AllArchive = () => {
    const { loading, error, data } = useQuery(GET_ARCHIVEDDOCUMENTS);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;
    console.log(data);
    console.log("hei");
    return data.allArchives.map((document: ArchivedDocument) => (
        <div key={document.id}>
            <img src={document.thumbnail} alt="" />
            <p>
                {document.id}: {document.title} - {document.date}- {document.typeDoc}- {document.url}-{" "}
                {console.log(document.urls)}
            </p>
        </div>
    ));
};

export default AllArchive;
