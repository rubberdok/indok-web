import { TextField, Grid } from "@material-ui/core"

const EditListingBody: React.FC<{content: string}> = ({ content }) => {
  return (
    <>
      <Grid container xs={10}>
          <TextField id="content" variant="outlined" multiline value={content} fullWidth rows={24} />
      </Grid>
    </>
  )
};

export default EditListingBody;