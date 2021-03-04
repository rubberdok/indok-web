import { useQuery } from "@apollo/client";
import { DOCUMENTS } from "@graphql/archive/queries";
import { Document } from "@interfaces/archive";

const AllArchive = () => {
  const { loading, error, data } = useQuery(DOCUMENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.allArchives.map((document: Document) => (
    <div key={document.id}>
      <img src={document.thumbnail} alt="" />
      <p>
        {document.id}: {document.title} - {document.date}- {document.typeDoc}- {document.webLink}-{" "}
      </p>
    </div>
  ));
};

export default AllArchive;
