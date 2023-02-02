import { Typography } from "@mui/material";

import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const JanusPage: NextPageWithLayout = () => {
  return (
    <Template title="Kjellern" description="">
      <Typography variant="body1" paragraph>
        Kjellern på Moholt er Indøk, Fysmat og Kjemi sitt offisielle utested, og er drevet at studenter ved linjene.
        Indøks Kjellerstyre er ansvarlig for all Janus sin aktivitet på Kjellern. Kjellern fungerer utmerket som et
        vors-sted, eller som et tidlig-fest-sted, siden baren må stenge 22:30 i hverdager og 23:30 i helger. Det er
        plass til 60 mennesker der, og alle som skal inn må ha legitimasjon (pga. at det er et offentlig utested). Det
        er ikke lov å ha med medbrakt inn, men Kjellern skal ikke tjene noe penger, så drikken er billig.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Hvordan booke kjellern:
      </Typography>
      <Typography variant="body1" paragraph>
        Om man ønsker å ha et arrangement på Kjellern er det lavterskel å sende mail til Kjellersjef, så kan man avtale
        nærmere.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Kjellersjef:
      </Typography>
      <Typography variant="body1" paragraph>
        Tobias S. Jortveit: tobiasjortveit@gmail.com
      </Typography>
      <Typography variant="h6" gutterBottom>
        Adresse til kjellern:
      </Typography>
      <Typography variant="body1" paragraph>
        Herman Krags veg 18, 7050 Trondheim
      </Typography>
    </Template>
  );
};

JanusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanusPage;
