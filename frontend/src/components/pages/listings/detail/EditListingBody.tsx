import { Card, CardContent, Grid, makeStyles } from "@material-ui/core";
import MarkdownForm from "@components/pages/listings/detail/MarkdownForm";


const ListingBody: React.FC<{
  description: string,
  onChange: () => void
}> = ({ description, onChange }) => {

  return (
    <Grid item xs={10}>
      <MarkdownForm markdown={description} onChange={onChange} />
    </Grid>
  );
};

export default ListingBody;
