import { Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";

import { ContactInfo } from "@/components/pages/Janus/ContactInfo";
import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import Eventsjef from "~/public/img/JanusstyretsMedlemmer/Eventsjef.jpg";
import Festsjef from "~/public/img/JanusstyretsMedlemmer/Festsjef.jpg";
import Hyttetursjef from "~/public/img/JanusstyretsMedlemmer/Hyttetursjef.jpg";
import JanusScriptRedaktør from "~/public/img/JanusstyretsMedlemmer/JanusScriptRedaktør.jpg";
import Kjellersjef from "~/public/img/JanusstyretsMedlemmer/Kjellersjef.jpg";
import Nestleder from "~/public/img/JanusstyretsMedlemmer/Nestleder.jpg";
import President from "~/public/img/JanusstyretsMedlemmer/President.jpg";
import PRsjef from "~/public/img/JanusstyretsMedlemmer/PRsjef.jpg";
import Sekretær from "~/public/img/JanusstyretsMedlemmer/Sekretær.jpg";
import Websjef from "~/public/img/JanusstyretsMedlemmer/Websjef.jpg";

const JanusPage: NextPageWithLayout = () => {
  const responsibles = [
    {
      id: 1,
      name: "Oskar Gåsø",
      position: "President",
      color: red[800],
      image: President,
      phonenumber: "tlf: 979 62 390",
      email: "oskar.gasoo@gmail.com",
    },
    {
      id: 2,
      name: "Markus Kile Søyland",
      position: "Økonomisjef/Nestleder",
      color: red[500],
      image: Nestleder,
      phonenumber: "tlf: 468 48 580",
      email: "marsoy2002@gmail.com",
    },
    {
      id: 3,
      name: "Fannar Steinn Lindal Rafnsson",
      position: "Websjef",
      color: red[500],
      image: Websjef,
      phonenumber: "tlf: 938 16 614",
      email: "fannar23@gmail.com",
    },
    {
      id: 4,
      name: "Didrik Næss",
      position: "JanusScript-Redaktør",
      color: red[500],
      image: JanusScriptRedaktør,
      phonenumber: "tlf: 476 57 533",
      email: "didriknaess@hotmail.com",
    },
    {
      id: 5,
      name: "Martin Nåtedal",
      position: "Hyttetursjef",
      color: red[500],
      image: Hyttetursjef,
      phonenumber: "tlf: 984 80 743",
      email: "martin.natedal@gmail.com",
    },
    {
      id: 6,
      name: "Tobias Jortveit",
      position: "Kjellersjef",
      color: red[500],
      image: Kjellersjef,
      phonenumber: "tlf: 953 66 176",
      email: "tobiasjortveit@gmail.com",
    },
    {
      id: 7,
      name: "Jenny Temmerud",
      position: "Festsjef",
      color: red[500],
      image: Festsjef,
      phonenumber: "tlf: 413 88 670",
      email: "jennywtemmerud@gmail.com",
    },
    {
      id: 8,
      name: "Philip Thomas Jenkins",
      position: "Eventsjef",
      color: red[500],
      image: Eventsjef,
      phonenumber: "tlf: 955 52 393",
      email: "philipthomasjenkinkins@hotmail.com",
    },
    {
      id: 9,
      name: "Mina Myrstøl",
      position: "PR-sjef",
      color: red[500],
      image: PRsjef,
      phonenumber: "tlf: 477 17 089",
      email: "myrmina@gmail.com",
    },
    {
      id: 10,
      name: "Hans Bertil Olsson",
      position: "Sekretær",
      color: red[500],
      image: Sekretær,
      phonenumber: "tlf: 482 92 265",
      email: "hansbert2002@gmail.com",
    },
  ];

  return (
    <Template title="Janus" description="Janus er indøkslinjeforening...">
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Typography>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Medlemmer
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={8}
        sx={{ mb: (theme) => theme.spacing(8) }}
      >
        {responsibles.map((responsible) => (
          <Grid container item sm={4} xs={8} key={responsible.id}>
            <ContactInfo
              name={responsible.name}
              email={responsible.email}
              phonenumber={responsible.phonenumber}
              image={responsible.image}
              position={responsible.position}
            />
          </Grid>
        ))}
      </Grid>
    </Template>
  );
};

JanusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanusPage;
