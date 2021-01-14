import { ArrowIcon } from "@components/ui/ArrowIcon";
import Router from "next/router";
import React from "react";
import styled from "styled-components";

const Rules = () => {
    const handleBackButtonClick = () => Router.back();

    return (
        <>
            <Logo src="/static/cabins/hyttestyret_logo.png"></Logo>
            <ArrowIcon direction={"l"} size={35} onClick={handleBackButtonClick}></ArrowIcon>

            <h1>Retningslinjer for booking av hytte</h1>

            <RuleHeader>Nøkkelansvarlig</RuleHeader>

            <p>§1.1 Nøkkelansvarlig er den som henter og leverer tilbake nøklene fra bookingansvarlig.</p>

            <p>
                §1.2 Nøkkelansvarlig har ansvar for og er pliktig til å gi tilbakemelding om eventuelle skader, mangler,
                naboklager, ikke tilfredsstillende utvask, reglementsbrudd og andre problemer som har oppstått under
                oppholdet.
            </p>

            <p>
                §1.3 Nøkkelansvarlig har ansvar for at alle ytterdører og vinduer er lukket og låst ved avreise samt å
                holde en forsvarlig innetemperatur både under eget opphold og etter avreise, se sjekkliste.
            </p>

            <p>
                §1.4 Nøkkelansvarlig har rett til å sette tema og bestemme hva hyttene skal brukes til under oppholdet.
            </p>

            <Sep />
            <RuleHeader>Bruksområde</RuleHeader>

            <p>
                §2.1 Hyttene skal disponeres til aktiviteter som innenfor rammene satt av nøkkelansvarlig. I hvor stor
                grad det eksempelvis kan festes, og til hvilken tid det forventes ro, avhenger av i hvilken grad
                nøkkelansvarlig har åpnet for slike aktiviteter. Sjekk med bookingsansvarlig, eller i kalenderen nederst
                på nettsiden, hvilket tema som er satt for det aktuelle tidsrommet før påmelding og avreise, og
                respekter dette.
            </p>

            <Sep />
            <RuleHeader>Nøkkelansvarlig</RuleHeader>

            <p>
                §3.1 Hyttestyret vil sanksjonere strengt mot ikke-registrert bruk av hyttene; både eget, og ved
                medbrakte venner.
            </p>
            <p>§3.2 Alle gjester må være registrert av bookingansvarlig.</p>

            <Sep />
            <RuleHeader>Reservasjon av enkeltplasser</RuleHeader>

            <p>§4.1 Den som reserverer gjestenes plasser har ansvar for deres handlinger.</p>

            <p>
                §4.2 Eksterne gjester er underlagt samme reglement som indøkere. Den som har ansvar for deres
                tilstedeværelse har også ansvar for at de er inneforstått med gjeldende reglement.
            </p>

            <p>
                §4.3 Eventuelle sanksjoner mot gjestene blir rettet mot personen selv og/eller mot indøkeren som
                reserverte dens plass. Hyttestyret vil avgjøre saksgangen ved slike tilfeller, se §9.
            </p>

            <Sep />
            <RuleHeader>Eksterne gjester</RuleHeader>

            <p>§5.1 Hyttene skal ved avreise være i like god eller bedre stand enn ved ankomst.</p>

            <p>
                §5.2 Utvask og avreiserutiner skal utføres i henhold til sjekkliste, se oppslag. Nøkkelansvarlig har
                ansvar for at dette blir etterfulgt.
            </p>

            <p>
                §5.3 Gjestene kan eventuelt komme til enighet om å leie inn vaskefirmaet 2rve Rengjøring AS via
                Hyttestyret. Dette må avtales med Hyttestyret minimum to dager før avreise, og dere vil i etterkant
                motta faktureringen på NOK 1200 eks. mva. per hytte.
            </p>

            <p>
                §5.4 Hyttene vil sjekkes av en representant fra 2rve Rengjøring etter hvert hyttebesøk. Ved mangelfull
                utvask vil gjestene faktureres for rengjøringskostnader i samme størrelsesorden som i §5.3.
            </p>

            <p>§5.5 Utsjekk senest kl. 14, med mindre annet er avtalt.</p>

            <p>§5.6 Innsjekk tidligst kl. 15, med mindre annet er avtalt.</p>

            <Sep />
            <RuleHeader>Utvask</RuleHeader>

            <p>
                <b>HYTTENE SKAL DISPONERES FORNUFTIG OG ETTER FØLGENDE ETISKE RETNINGSLINJER:</b>
            </p>

            <p>
                §6.1 Alle har meldeplikt overfor nøkkelansvarlig og erstatningsansvar for eventuelle skader de selv
                forårsaker.
            </p>

            <p>
                §6.2 Vis hensyn til de andre hyttegjestene. Utover rammene for bruksområde, se §2, gjelder normal
                folkeskikk.
            </p>

            <p>§6.3 Ta hensyn til nabohyttene, ta eventuelle naboklager til følge umiddelbart.</p>

            <p>
                §6.4 Vis fornuftig strømforbruk slik at driftskostnadene, og dermed leieprisene, forholder seg lave.
                Skru av lys i rom som ikke er i bruk, påse at panelovner er satt til 13 ᵒC, og slå av badstuen når den
                ikke er i bruk.
            </p>

            <p>§6.5 Tyveri av inventar og bruksmidler er strengt ulovlig og vil bli slått hardt ned på.</p>

            <p>
                §6.6 Husk at dette er Indøks hytter, og med det dine egne hytter. Problemer skapt går også ut over deg
                selv. Føl deg som hjemme, og behandle hyttene som om det skulle vært ditt eget hjem.
            </p>

            <p>§6.7 Røyking er forbudt innendørs på hyttene.</p>

            <Sep />
            <RuleHeader>Etikette</RuleHeader>

            <p>§7.1 Ved ødeleggelse eller brudd på reglementet har Hyttestyret full sanksjonsrett.</p>

            <p>
                §7.2 Ved tap av nøkkel faktureres nøkkelansvarlig et gebyr direkte. Hvorvidt resterende gjester skal
                bidra til å dekke gebyret eller ikke, tar ikke Hyttestyret stilling til. Ved tap av hyttenøkkel
                faktureres NOK 1000.
            </p>

            <p>
                §7.3 Ved skade på hytte eller inventar faktureres de ansvarlig tilsvarende reparasjons- eller
                innkjøpskostnad.
            </p>

            <p>
                §7.4 Ved mangelfull utvask vil nøkkelansvarlig faktureres et gebyr direkte. Hvorvidt resterende gjester
                skal bidra til å dekke gebyret eller ikke, tar ikke Hyttestyret stilling til. Se § 5.
            </p>

            <p>
                §7.5 Andre brudd på reglementet kan medføre nedprioritering av senere reservasjoner eller periodevis
                utestengelse fra hyttene.
            </p>

            <Sep />
            <RuleHeader>Sanksjoner</RuleHeader>

            <p>
                Dersom dere skulle ha noen spørsmål ut over den informasjonen som er gitt i kontrakten og sjekklisten,
                og dersom det skulle være skader eller mangler som omgående bør sees til, kontakt oss.
            </p>

            <p>
                <b>Leder Philip Kolkmeier - 906 71 650</b>
            </p>
            <p>
                <b>Bookingansvarlig Ellie Berglund - 942 48 380</b>
            </p>
        </>
    );
};

const Logo = styled.img`
    margin: auto;
    width: 30vh;
`;

const Sep = styled.div`
    width: 100%;
    height: 2px;
    background-color: black;
    margin-top: 40px;
    margin-bottom: 40px;
`;

const RuleHeader = styled.h3`
    color: #f40082;
`;

export default Rules;
