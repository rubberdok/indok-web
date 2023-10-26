import { Box, Typography } from "@mui/material";

import { ImageSlider } from "@/components/pages/cabins/ImageSlider/ImageSlider";
import {
  aareturImages,
  immballImages,
  janusvalgetImages,
  winterGamesImages,
  borsfestImages,
  fadderukeImages,
  oktoberfestImages,
  maiImages,
} from "@/components/pages/Janus/EventImages/imageData";
import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ArrangementPage: NextPageWithLayout = () => {
  return (
    <Template title="Årlige Arrangementer" description="Informasjon om våre årlige arrangementer og tradisjoner ">
      <Typography variant="h3" gutterBottom>
        Fadderuker
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={fadderukeImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Hvert år arrangerer Janus to fantastiske fadderuker for de nyopptatte førsteklassingene. Fadderukene er en
        glimrende måte å bli kjent med medstudenter, Trondheim og Indøk på! Det arrangeres alt fra kjellerfest til
        togaparty til aktivitetsdag og beerlympics. Fadderukene er det største arrangementet Janus står for, og det
        gøyeste som skjer hvert år, da vi får mulighet til å bli kjent med de nye førsteklassingene!
      </Typography>
      <Typography variant="h3" gutterBottom>
        Immatrikuleringsball
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={immballImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Immatrikuleringsball arrangeres etter fadderukene for å ta imot de nye førstklassingene. Tradisjonelt sett er
        immball etter opptaket, slik at man kan feire nyopptatte janusere. Man kler seg opp i finstas og blir servert
        flere retter, mens underholdning som taler, koropptredener og allsang foregår på scenen. Kvelden avsluttes med
        opptreden fra vårt kjære Bandøk! Før immball avholodes det 1./5. og 2./4. vors, slik at man kan bli kjent med
        studenter fra eldre og yngre kull. Mer enn noe annet arrangement, samler immball alle studentene på indøk,
        uavhengig av kull.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Winter Games
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={winterGamesImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Wintergames avholdes i marka og tilbyr masse gøye vinteraktiviteter. I tillegg er det Jägerløp, Folkeløp og
        ekstremt prisgunstige shots. Vi er også heldige som får besøk av Bandøk, slik at man får danset fra seg etter
        aktivitetene.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Janusvalget
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={janusvalgetImages} displayLabelText={true}></ImageSlider>
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
        <ImageSlider imageData={aareturImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        I likhet med mange andre linjeforeninger på Gløshaugen, drar Janus på tur til Åre i Sverige hvert år i januar.
        Janus arrangerer hovedsakelig turen for førsteklassinger, men i tradisjon tro stiller også de andre kullene
        klare for slalåmløyper i verdensklasse og tidenes beste afterski. Med Åretur kommer selvsagt også Indøks egne
        årlige “Åresang” og eget Åremerch. Dette er ditt livs tur, og de fleste indøkeres favoritt janusarrangement!
      </Typography>
      <Typography variant="h3" gutterBottom>
        Børsfest
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={borsfestImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Børsfest er Kjellerstyrets største arrangement gjennom året. Da samles hele indøk på BSK-hytta i marka, hvor man
        får anledning til å bade i penger, hooke under “Hooke-hornet” og ikke minst, kjøpe øl i takt med børsens opp- og
        nedturer gjennom historien. Dette er en fest du ikke vil gå glipp av!
      </Typography>
      <Typography variant="h3" gutterBottom>
        Oktoberfest
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={oktoberfestImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Hvert partallsår arrangerer Janus oktoberfest, for øltørste indøkere. UKA står for oktoberfest de andre årene,
        men Janus skaper minst like stor fest. Oktoberfest byr på pølser, øl, tautrekking, traktekonkurranse og masse
        andre gøye låveaktiviteter. Dette er et arrangement for alle som er glad i konkurranser og som liker å gå i
        Dirndl eller Lederhosen.
      </Typography>
      <Typography variant="h3" gutterBottom>
        17. mai
      </Typography>
      <Box width="100%" marginBottom={2}>
        <ImageSlider imageData={maiImages} displayLabelText={true}></ImageSlider>
      </Box>
      <Typography variant="body1" paragraph>
        Janus arrangerer hvert år 17.mai for alle studenter ved indøk. Man tar kullbilder og feirer nasjonaldagen med
        kake og cava. I tillegg går vi sammen i folketoget gjennom Trondheim sentrum under janusfanen!
      </Typography>
    </Template>
  );
};

ArrangementPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ArrangementPage;
