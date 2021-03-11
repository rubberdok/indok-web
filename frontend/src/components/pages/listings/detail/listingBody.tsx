import { Listing } from "@interfaces/listings";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Hidden,
} from "@material-ui/core"

import dayjs from "dayjs";
import nb from "dayjs/locale/nb";


interface ListingBodyProps {
  listing: Listing
}



const ListingBody: React.FC<ListingBodyProps> = ({ listing }) => { 
  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={2}>
          
          <Grid item>
            <Hidden smDown>
              <Typography variant="h1" component="h1">
                {listing.title}
              </Typography>
            </Hidden>
            <Hidden mdUp>
            <Typography variant="h3" component="h1">
                {listing.title}
              </Typography>
            </Hidden>
            <Typography variant="caption" component="h2"> 
              Søknadsfrist {dayjs(listing.deadline).locale(nb).format("dddd D. MMMM YYYY [kl.] HH:mm")}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="body1" component="p">
              {listing.description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
};

export default ListingBody;