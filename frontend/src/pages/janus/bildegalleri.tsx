import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const JanusPage: NextPageWithLayout = () => {
  return (
    <Template
      title="Bildegalleri"
      description="Se bildene fra Janus linjeforening sine arrangementer"
      // eslint-disable-next-line react/no-children-prop
      children={undefined}
    ></Template>
  );
};

JanusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanusPage;

//dropzoneJS
