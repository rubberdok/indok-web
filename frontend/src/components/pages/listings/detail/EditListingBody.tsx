import { TextField, Grid, Paper, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6),
    width: "100%",
  }
}));

const EditListingBody: React.FC<{content: string, onChange: (event) => void}> = ({ content, onChange }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container xs={10}>
        <Paper className={classes.root}>
          <TextField id="content" variant="outlined" multiline value={content} fullWidth rows={24} onChange={onChange} />
        </Paper>
      </Grid>
    </>
  )
};

export default EditListingBody;