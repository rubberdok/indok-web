import { ArrowIcon } from "@components/ui/ArrowIcon";
import Router, { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Contract = () => {
  const currentTime = new Date().toLocaleString();

  const router = useRouter();
  const query = router.query;

  const handleBackButtonClick = () => Router.back();

  return (
    <>
      <div>
        <Logo src="/static/cabins/hyttestyret_logo.png"></Logo>
        <ArrowIcon direction={"l"} size={35} onClick={handleBackButtonClick}></ArrowIcon>
        <h1>KONTRAKT</h1>
        <h3>Utleieavtale</h3>
        <p>
          På vegne av Foreningen for studenter ved Industriell økonomi og teknologiledelse er det i dag inngått følgende
          leiekontrakt mellom Hyttestyret og{" "}
          <b>
            {query.firstname} {query.surname}
          </b>
          <br />
        </p>
        <p>
          Gjeldende <br />
          Leieobjekt: <b>{query.cabin}</b>, Landsbygrenda, 7340 Oppdal
          <br />
          Leieperiode: <b>{query.fromDate}</b> - <b>{query.toDate}</b> (yyyy-mm-dd)
          <br />
          Leiesum: <b>{query.price}</b> NOK innbetalt til konto 9235.28.31311 i forkant av leieperioden.
        </p>
        <p>
          Leietager betaler ikke depositum i forkant av leieperioden, men eventuelle skader på hytte eller inventar samt
          mangelfull vask før avreise faktureres leietager i etterkant av leieperioden. Fratrekkets størrelsesorden vil
          være gitt av rimeligste alternativ for reparasjon, nyinnkjøp eller vask.
        </p>
        <p>
          Leieobjektet skal kun benyttes av leietagers forening, og fremleie av leieobjektet er således ikke tillatt.
          Som fremleie likestilles at enhver som ikke er i forbindelse med den eller de som har signert leieavtalen
          benytter leieobjektet. Under leieperioden skal kontraktsignatør til enhver tid ha kontroll på de besøkende, og
          sørge for at leieobjektet aldri blir forlatt ulåst. Bookingansvarlig forebeholder retten til å kreve
          klokkeslett for avgang på leieperiodens siste dag, men ikke tidligere enn 14:00.
        </p>
        <br />
        <p>Leietager plikter å</p>
        <ul>
          <li>
            behandle hytta og dens inventar med aktsomhet, og stilles erstatningspliktig til all skade som skyldes ham
            selv eller medleietagere. Særskilt fører tap av hyttenøkkel til etterfakturering på NOK 1000,-
          </li>
          <li>
            følge sjekkliste for utvask ut av hytta etter bruk. Utvask som ikke oppfyller kravene fører til
            etterfakturering på NOK 1600,-
          </li>
          <li>
            følge de bruksregler som gjelder for hytta, og ved leieforholdets opphør se til at de øvrige forpliktelser i
            henhold til kontrakten er blitt holdt, se vedlagte sjekkliste.{" "}
          </li>
          <li>
            straks melde fra om skader eller mangler som må utbedres uten opphold, til utleier ved bookingansvarlig
            Ellie Berglund på telefon 943 58 380. Annen skade eller mangler meldes fra til utleier i sammenheng med
            tilbakelevering av nøkler ved endt leieperiode.
          </li>
          <li>Lese grundig i gjennom hyttenes reglement som ligger tilgjengelig på indokhyttene.no.</li>
        </ul>
        <p>Utleier plikter å</p>
        <ul>
          <li>sørge for at hytta er i forsvarlig stand ved leieforholdets start.</li>
          <li>sørge for at alle forsikringer er i orden.</li>
          <li>utbedre mangler og skader som ikke er utbedret av leietager, om berettiget, på leietakers regning.</li>
        </ul>
        <br />
        <p>Partene vedtar eiendommens verneting i alle tvister som måtte oppstå i forbindelse med avtalen.</p>
        <p>
          Flytter ikke leietager når leieperioden er utløpt, kan vedkommende kastes ut uten søksmål og dom etter § 13-2
          i Tvangsfullbyrdelsesloven.{" "}
        </p>
        <p> Denne leieavtalen er utstedt i 2 – to – eksemplarer, ett til hver av partene.</p>
        <p>
          Sted/dato: <b>{currentTime}</b>
        </p>
      </div>
    </>
  );
};

const Logo = styled.img`
  margin: auto;
  width: 30vh;
`;

export default Contract;
