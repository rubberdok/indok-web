import { Listing } from "@interfaces/listings";
import { Card, CardContent, Grid, Typography, Hidden } from "@material-ui/core";

import dayjs from "dayjs";
import nb from "dayjs/locale/nb";

interface ListingBodyProps {
  listing: Listing;
}

// component for the main body of a listing's detail
const ListingBody: React.FC<ListingBodyProps> = ({ listing }) => (
  <Card>
    <CardContent>
      
    </CardContent>
  </Card>
);

export default ListingBody;
