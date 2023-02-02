import { Box, Typography } from "@mui/material";

import { ImageSlider } from "@/components/pages/cabins/ImageSlider/ImageSlider";
import {
  aareturImages,
  immballImages,
  janusvalgetImages,
  winterGamesImages,
  borsfestImages,
} from "@/components/pages/Janus/EventImages/imageData";
import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const ArrangementPage: NextPageWithLayout = () => {
  return (
    <Template title="Årlige Arrangementer" description="Informasjon om våre årlige arrangementer og tradisjoner">
      <Typography variant="h3" gutterBottom>
        Immatrikuleringsball
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={immballImages} displayLabelText={false}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum ipsa consectetur, illum pariatur id sed,
        commodi repellendus eos, impedit debitis eligendi voluptas atque iure animi ea molestiae veritatis officiis
        dolore?
      </Typography>
      <Typography variant="h3" gutterBottom>
        Winter Games
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={winterGamesImages} displayLabelText={false}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque, iusto. Mollitia assumenda in ipsa inventore
        vitae nihil quidem fugit rerum doloribus beatae, quaerat modi ea quo. Doloremque quaerat aspernatur autem?
      </Typography>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Quisquam, quae. Quisquam, quae.
        Quisquam,
      </Typography>
      <Typography variant="h3" gutterBottom>
        Janusvalget
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={janusvalgetImages} displayLabelText={false}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Valg av nye styremedlemmer foregår på Janusvalget, der alle indøkere kan møte opp og har stemmerett. Om man
        ønsker, kan man gi styret beskjed på forhånd at man vil stille til valg, men det er også fullt mulig å kunngjøre
        at man stiller når vi ber kandidatene tre frem. Det er også åpent for benkeforslag fra salen. Om våren velges
        det ny president, nestleder, JanuScript-redaktør, websjef, hyttetursjef og kjellersjef, mens det på høsten er
        festsjef, eventsjef, PR-sjef og sekretær som velges.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Åretur
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={aareturImages} displayLabelText={false}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia delectus ea perspiciatis accusantium
        necessitatibus fugit reprehenderit fugiat enim, reiciendis dolore. Est consectetur possimus dignissimos voluptas
        facilis quis enim similique sit!
      </Typography>
      <Typography variant="h3" gutterBottom>
        Børsfest
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={borsfestImages} displayLabelText={false}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia delectus ea perspiciatis accusantium
        necessitatibus fugit reprehenderit fugiat enim, reiciendis dolore. Est consectetur possimus dignissimos voluptas
        facilis quis enim similique sit!
      </Typography>
    </Template>
  );
};

ArrangementPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ArrangementPage;
