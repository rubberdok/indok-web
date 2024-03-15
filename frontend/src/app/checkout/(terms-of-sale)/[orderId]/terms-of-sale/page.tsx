import { Link } from "@/app/components/Link";
import { List, ListItem, Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <Stack direction="column">
      <Typography variant="h5" component="h1">
        Standard salgsbetingelser for forbrukerkjøp av varer over Internett
      </Typography>
      <Stack component="article" role="article">
        <Stack component="section" id="chapter-0">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            Innledning
          </Typography>

          <div>
            <Typography gutterBottom>
              Dette kjøpet er regulert av de nedenstående standard salgsbetingelser for forbrukerkjøp av varer over
              Internett. Forbrukerkjøp over internett reguleres hovedsakelig av avtaleloven, forbrukerkjøpsloven,
              markedsføringsloven, angrerettloven og ehandelsloven, og disse lovene gir forbrukeren ufravikelige
              rettigheter. Lovene er tilgjengelig på{" "}
              <Link target="_blank" href="https://www.lovdata.no/" rel="noreferrer">
                www.lovdata.no.
              </Link>{" "}
              Vilkårene i denne avtalen skal ikke forstås som noen begrensning i de lovbestemte rettighetene, men
              oppstiller partenes viktigste rettigheter og plikter for handelen.
            </Typography>
            <Typography gutterBottom>
              Salgsbetingelsene er utarbeidet og anbefalt av Forbrukertilsynet.{" "}
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://www.forbrukertilsynet.no/lov-og-rett/veiledninger-og-retningslinjer/veiledning-standard-salgsbetingelser-forbrukerkjop-varer-internett"
              >
                For en bedre forståelse av disse salgsbetingelsene, se Forbrukertilsynets veileder her.{" "}
              </Link>
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-1">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            1. Avtalen
          </Typography>

          <div>
            <Typography gutterBottom>
              Avtalen består av disse salgsbetingelsene, opplysninger gitt i bestillingsløsningen og eventuelt særskilt
              avtalte vilkår. Ved eventuell motstrid mellom opplysningene, går det som særskilt er avtalt mellom partene
              foran, så fremt det ikke strider mot ufravikelig lovgivning.
            </Typography>
            <Typography gutterBottom>
              Avtalen vil i tillegg bli utfylt av relevante lovbestemmelser som regulerer kjøp av varer mellom
              næringsdrivende og forbrukere.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-2">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            2. Partene
          </Typography>

          <div>
            <Typography gutterBottom>
              Selger er Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU, Kolbjørn Hejes vei
              1E, 7034 Trondheim, leder@indokhs.no, Org.nr. 994 778 463, og betegnes i det følgende som
              &nbsp;selger/selgeren.
            </Typography>
            <Typography gutterBottom>
              Kjøper er den forbrukeren som foretar bestillingen, og betegnes i det følgende som &nbsp;kjøper/kjøperen.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-3">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            3. Pris
          </Typography>

          <div>
            <Typography gutterBottom>
              Den oppgitte prisen for varen og tjenester er den totale prisen kjøper skal betale. Denne prisen
              inkluderer alle avgifter og tilleggskostnader. Ytterligere kostnader som selger før kjøpet ikke har
              informert om, skal kjøper ikke bære.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-4">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            4. Avtaleinngåelse
          </Typography>

          <div>
            <Typography gutterBottom>
              Avtalen er bindende for begge parter når kjøperen har sendt sin bestilling til selgeren.
            </Typography>
            <Typography gutterBottom>
              Avtalen er likevel ikke bindende hvis det har forekommet skrive- eller tastefeil i tilbudet fra selgeren i
              bestillingsløsningen i nettbutikken eller i kjøperens bestilling, og den annen part innså eller burde ha
              innsett at det forelå en slik feil.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-5">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            5. Betalingen
          </Typography>

          <div>
            <Typography gutterBottom>
              Selgeren kan kreve betaling for varen fra det tidspunkt den blir sendt fra selgeren til kjøperen.
            </Typography>
            <Typography gutterBottom>
              Dersom kjøperen bruker kredittkort eller debetkort ved betaling, kan selgeren reservere kjøpesummen på
              kortet ved bestilling. Kortet blir belastet samme dag som varen sendes.
            </Typography>
            <Typography gutterBottom>
              Ved betaling med faktura, blir fakturaen til kjøperen utstedt ved forsendelse av varen. Betalingsfristen
              fremgår av fakturaen og er på minimum 14 dager fra mottak.
            </Typography>
            <Typography gutterBottom>Kjøpere under 18 år kan ikke betale med etterfølgende faktura.</Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-6">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            6. Levering
          </Typography>

          <div>
            <Typography gutterBottom>
              Levering er skjedd når kjøperen, eller hens representant, har overtatt tingen.
            </Typography>
            <Typography gutterBottom>
              Hvis ikke leveringstidspunkt fremgår av bestillingsløsningen, skal selgeren levere varen til kjøper uten
              unødig opphold og senest 30 dager etter bestillingen fra kunden. Varen skal leveres hos kjøperen med
              mindre annet er særskilt avtalt mellom partene.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-7">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            7. Risikoen for varen
          </Typography>

          <div>
            <Typography gutterBottom>
              Risikoen for varen går over på kjøper når hen, eller hens representant, har fått varene levert i tråd med
              punkt 6.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-8">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            8. Angrerett
          </Typography>

          <div>
            <Typography gutterBottom>
              Med mindre avtalen er unntatt fra angrerett, kan kjøperen angre kjøpet av varen i henhold til
              angrerettloven.
            </Typography>
            <Typography gutterBottom>
              Kjøperen må gi selger melding om bruk av angreretten innen 14 dager fra fristen begynner å løpe. I fristen
              inkluderes alle kalenderdager. Dersom fristen ender på en lørdag, helligdag eller høytidsdag forlenges
              fristen til nærmeste virkedag.
            </Typography>
            <Typography gutterBottom>
              Angrefristen anses overholdt dersom melding er sendt før utløpet av fristen. Kjøper har bevisbyrden for at
              angreretten er blitt gjort gjeldende, og meldingen bør derfor skje skriftlig (angrerettskjema, e-post
              eller brev).
            </Typography>
            <Typography gutterBottom>Angrefristen begynner å løpe:</Typography>
            <List
              sx={{
                listStyleType: "disc",
                listStylePosition: "inside",
                "& .MuiListItem-root": {
                  display: "list-item",
                },
              }}
            >
              <ListItem>
                Ved kjøp av enkeltstående varer vil angrefristen løpe fra dagen etter varen(e) er mottatt.
              </ListItem>
              <ListItem>
                Selges et abonnement, eller innebærer avtalen regelmessig levering av identiske varer, løper fristen fra
                dagen etter første forsendelse er mottatt.
              </ListItem>
              <ListItem>
                Består kjøpet av flere leveranser, vil angrefristen løpe fra dagen etter siste leveranse er mottatt.
              </ListItem>
            </List>
            <Typography gutterBottom>
              Angrefristen utvides til 12 måneder etter utløpet av den opprinnelige fristen dersom selger ikke før
              avtaleinngåelsen opplyser om at det foreligger angrerett og standardisert angreskjema. Tilsvarende gjelder
              ved manglende opplysning om vilkår, tidsfrister og fremgangsmåte for å benytte angreretten. Sørger den
              næringsdrivende for å gi opplysningene i løpet av disse 12 månedene, utløper angrefristen likevel 14 dager
              etter den dagen kjøperen mottok opplysningene.
            </Typography>
            <Typography gutterBottom>
              Ved bruk av angreretten må varen leveres tilbake til selgeren uten unødig opphold og senest 14 dager fra
              melding om bruk av angreretten er gitt. Kjøper dekker de direkte kostnadene ved å returnere varen, med
              mindre annet er avtalt eller selger har unnlatt å opplyse om at kjøper skal dekke returkostnadene.
              Selgeren kan ikke fastsette gebyr for kjøperens bruk av angreretten.
            </Typography>
            <Typography gutterBottom>
              Kjøper kan prøve eller teste varen på en forsvarlig måte for å fastslå varens art, egenskaper og funksjon,
              uten at angreretten faller bort. Dersom prøving eller test av varen går utover hva som er forsvarlig og
              nødvendig, kan kjøperen bli ansvarlig for eventuell redusert verdi på varen.
            </Typography>
            <Typography gutterBottom>
              Selgeren er forpliktet til å tilbakebetale kjøpesummen til kjøperen uten unødig opphold, og senest 14
              dager fra selgeren fikk melding om kjøperens beslutning om å benytte angreretten. Selger har rett til å
              holde tilbake betalingen til hen har mottatt varene fra kjøperen, eller til kjøper har lagt frem
              dokumentasjon for at varene er sendt &nbsp;tilbake.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-9">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            9. Forsinkelse og manglende levering - kjøpernes rettigheter og frist for å melde krav
          </Typography>

          <div>
            <Typography gutterBottom>
              Dersom selgeren ikke leverer varen eller leverer den for sent i henhold til avtalen mellom partene, og
              dette ikke skyldes kjøperen eller forhold på kjøperens side, kan kjøperen i henhold til reglene i
              forbrukerkjøpslovens kapittel 5 etter omstendighetene <em>holde kjøpesummen tilbake</em>, kreve{" "}
              <em>oppfyl</em>
              <em>lelse</em>, <em>heve </em>avtalen og/eller kreve <em>erstatning </em>fra selgeren.
            </Typography>
            <Typography gutterBottom>
              Ved krav om misligholdsbeføyelser bør meldingen av bevishensyn være skriftlig (for eksempel e-post).
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Oppfyllelse
            </Typography>
            <Typography gutterBottom>
              Kjøper kan fastholde kjøpet og kreve oppfyllelse fra selger. Kjøper kan imidlertid ikke kreve oppfyllelse
              dersom det foreligger en hindring som selgeren ikke kan overvinne, eller dersom oppfyllelse vil medføre en
              så stor ulempe eller kostnad for selger at det står i vesentlig misforhold til kjøperens interesse i at
              selgeren oppfyller. Skulle vanskene falle bort innen rimelig tid, kan kjøper likevel kreve oppfyllelse.
            </Typography>
            <Typography gutterBottom>
              Kjøperen taper sin rett til å kreve oppfyllelse om hen eller hun venter urimelig lenge med å fremme
              kravet.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Heving
            </Typography>
            <Typography gutterBottom>
              Dersom selgeren ikke leverer varen på leveringstidspunktet, skal kjøperen oppfordre selger til å levere
              innen en rimelig tilleggsfrist for oppfyllelse. Dersom selger ikke leverer varen innen tilleggsfristen,
              kan kjøperen heve kjøpet.
            </Typography>
            <Typography gutterBottom>
              Kjøper kan imidlertid heve kjøpet umiddelbart hvis selger nekter å levere varen. Tilsvarende gjelder
              dersom levering til avtalt tid var avgjørende for inngåelsen av avtalen, eller dersom kjøperen har
              underrettet selger om at leveringstidspunktet er avgjørende.
            </Typography>
            <Typography gutterBottom>
              Leveres tingen etter tilleggsfristen forbrukeren har satt eller etter leveringstidspunktet som var
              avgjørende for inngåelsen av avtalen, må krav om heving gjøres gjeldende innen rimelig tid etter at
              kjøperen fikk vite om leveringen.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Erstatning
            </Typography>
            <Typography gutterBottom>
              Kjøperen kan kreve erstatning for lidt tap som følge av forsinkelsen. Dette gjelder imidlertid ikke dersom
              selgeren godtgjør at forsinkelsen skyldes hindring utenfor selgers kontroll som ikke med rimelighet kunne
              blitt tatt i betraktning på avtaletiden, unngått, eller overvunnet følgene av.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-10">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            10. Mangel ved varen - kjøperens rettigheter og reklamasjonsfrist
          </Typography>

          <div>
            <Typography gutterBottom>
              Hvis det foreligger en mangel ved varen må kjøper innen rimelig tid etter at den ble oppdaget eller burde
              ha blitt oppdaget, gi selger melding om at hen eller hun vil påberope seg mangelen. Kjøper har alltid
              reklamert tidsnok dersom det skjer innen 2 mnd. fra mangelen ble oppdaget eller burde blitt oppdaget.
              Reklamasjon kan skje senest to år etter at kjøper overtok varen. Dersom varen eller deler av den er ment å
              vare vesentlig lenger enn to år, er reklamasjonsfristen fem år.
            </Typography>
            <Typography gutterBottom>
              Dersom varen har en mangel og dette ikke skyldes kjøperen eller forhold på kjøperens side, kan kjøperen i
              henhold til reglene i forbrukerkjøpsloven kapittel 6 etter omstendighetene{" "}
              <em>holde kjøpesummen tilbake</em>, velge mellom <em>retting </em>og <em>omlevering</em>, kreve{" "}
              <em>prisavslag</em>, kreve avtalen hevet og/eller kreve <em>erstatning&nbsp; </em>fra selgeren.
            </Typography>
            <Typography gutterBottom>Reklamasjon til selgeren bør skje skriftlig.</Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Retting eller omlevering
            </Typography>
            <Typography gutterBottom>
              Kjøperen kan velge mellom å kreve mangelen rettet eller levering av tilsvarende ting. Selger kan likevel
              motsette seg kjøperens krav dersom gjennomføringen av kravet er umulig eller volder selgeren urimelige
              kostnader. Retting eller omlevering skal foretas innen rimelig tid. Selger har i utgangspunktet ikke rett
              til å foreta mer enn to avhjelpsforsøk for samme mangel.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Prisavslag
            </Typography>
            <Typography gutterBottom>
              Kjøper kan kreve et passende prisavslag dersom varen ikke blir rettet eller omlevert. Dette innebærer at
              forholdet mellom nedsatt og avtalt pris svarer til forholdet mellom tingens verdi i mangelfull og
              kontraktsmessig stand. Dersom særlige grunner taler for det, kan prisavslaget i stedet settes lik
              mangelens betydning for kjøperen.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Heving
            </Typography>
            <Typography gutterBottom>
              Dersom varen ikke er rettet eller omlevert, kan kjøperen også heve kjøpet når mangelen ikke er uvesentlig.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-11">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            11. Selgerens rettigheter ved kjøperens mislighold
          </Typography>

          <div>
            <Typography gutterBottom>
              Dersom kjøperen ikke betaler eller oppfyller de øvrige pliktene etter avtalen eller loven, og dette ikke
              skyldes selgeren eller forhold på selgerens side, kan selgeren i henhold til reglene i forbrukerkjøpsloven
              kapittel 9 etter omstendighetene <em>holde</em> <em>varen tilbake</em>, kreve <em>oppfyllelse </em>av
              avtalen, kreve avtalen <em>hevet </em>samt kreve <em>erstatning </em>fra kjøperen. Selgeren vil også etter
              omstendighetene kunne kreve <em>renter ved forsinket betaling, inkassogebyr</em> og et rimelig{" "}
              <em>gebyr ved uavhentede varer</em>.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Oppfyllelse
            </Typography>
            <Typography gutterBottom>
              Selger kan fastholde kjøpet og kreve at kjøperen betaler kjøpesummen. Er varen ikke levert, taper selgeren
              sin rett dersom hen venter urimelig lenge med å fremme kravet.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Heving
            </Typography>
            <Typography gutterBottom>
              Selger kan heve avtalen dersom det foreligger vesentlig betalingsmislighold eller annet vesentlig
              mislighold fra kjøperens side. Selger kan likevel ikke heve dersom hele kjøpesummen er betalt. Fastsetter
              selger en rimelig tilleggsfrist for oppfyllelse og kjøperen ikke betaler innen denne fristen, kan selger
              heve kjøpet.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Renter ved forsinket betaling/inkassogebyr
            </Typography>
            <Typography gutterBottom>
              Dersom kjøperen ikke betaler kjøpesummen i henhold til avtalen, kan selger kreve renter av kjøpesummen
              etter forsinkelsesrenteloven. Ved manglende betaling kan kravet, etter forutgående varsel, bli sendt til
              Kjøper kan da bli holdt ansvarlig for gebyr etter inkassoloven.
            </Typography>
            <Typography component="h3" variant="subtitle2" gutterBottom>
              Gebyr ved uavhentede ikke-forskuddsbetalte varer
            </Typography>
            <Typography gutterBottom>
              Dersom kjøperen unnlater å hente ubetalte varer, kan selger belaste kjøper med et gebyr. Gebyret skal
              maksimalt dekke selgerens faktiske &nbsp;utlegg for å levere varen til kjøperen. Et slikt gebyr kan ikke
              belastes kjøpere under 18 &nbsp;år.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-12">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            12. Garanti
          </Typography>

          <div>
            <Typography gutterBottom>
              Garanti som gis av selgeren eller produsenten, gir kjøperen rettigheter i tillegg til de kjøperen allerede
              har etter ufravikelig lovgivning. En garanti innebærer dermed ingen begrensninger i kjøperens rett til
              reklamasjon og krav ved forsinkelse eller mangler etter punkt 9 og 10.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-13">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            13. Personopplysninger
          </Typography>

          <div>
            <Typography gutterBottom>
              Behandlingsansvarlig for innsamlede personopplysninger er selger. Med mindre kjøperen samtykker til noe
              annet, kan selgeren, i tråd med personopplysningsloven, kun innhente og lagre de personopplysninger som er
              nødvendig for at selgeren skal kunne gjennomføre forpliktelsene etter avtalen. Kjøperens
              personopplysninger vil kun bli utlevert til andre hvis det er nødvendig for at selger skal få gjennomført
              avtalen med kjøperen, eller i lovbestemte tilfelle.
            </Typography>
          </div>
        </Stack>
        <Stack component="section" id="chapter-14">
          <Typography variant="subtitle1" component="h2" gutterBottom>
            14. Konfliktløsning
          </Typography>

          <div>
            <Typography gutterBottom>
              Klager rettes til selger innen rimelig tid, jf. punkt 9 og 10. Partene skal forsøke å løse eventuelle
              tvister i minnelighet. Dersom dette ikke lykkes, kan kjøperen ta kontakt med Forbrukerrådet for mekling.
              Forbrukerrådet er tilgjengelig &nbsp;på &nbsp;telefon 23&nbsp; 400&nbsp; 500&nbsp; eller{" "}
              <Link target="_blank" href="https://www.forbrukerradet.no/" rel="noreferrer">
                www.forbrukerradet.no.
              </Link>
            </Typography>
            <Typography gutterBottom>
              Europa-Kommisjonens klageportal kan også brukes hvis du ønsker å inngi en klage. Det er særlig relevant,
              hvis du er forbruker bosatt i et annet EU-land. Klagen inngis her:&nbsp;
              <Link target="_blank" rel="noreferrer" href="https://ec.europa.eu/odr">
                https://ec.europa.eu/odr
              </Link>
              .
            </Typography>
            <Typography gutterBottom>&nbsp;</Typography>
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
}
