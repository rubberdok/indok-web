import Layout from "@components/Layout";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  Typography,
  CircularProgress,
  CardHeader,
  makeStyles,
} from "@material-ui/core";
import { deepPurple, deepOrange, indigo } from "@material-ui/core/colors";
import { NextPage } from "next";

const useStyles = makeStyles((theme) => ({
  form: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  },
}));

const ReportsPage: NextPage = () => {
  const classes = useStyles();
  const responsibles = [
    {
      id: 1,
      name: "Maria Ruiz",
      year: "4",
      initials: "MR",
      color: deepPurple[500],
    },
    {
      id: 2,
      name: "Lars Waage",
      year: "4",
      initials: "LW",
      color: deepOrange[500],
    },
    {
      id: 3,
      name: "Hermann Mørkrid",
      year: "4",
      initials: "HM",
      color: indigo[500],
    },
  ];

  return (
    <Layout>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
        style={{ marginTop: 16, marginBottom: 16 }}
      >
        <Grid item container direction="column" justify="center" alignItems="center" spacing={4} md={8}>
          <Grid item>
            <Typography variant="h1">Varslinger</Typography>
          </Grid>
          <Grid item md>
            <Card>
              <CardHeader title="Informasjon" />
              <CardContent>
                <Typography variant="body1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid className={classes.form} container item justify="space-between" alignItems="stretch" spacing={4}>
            <Grid item md>
              <Card>
                <CardContent>
                  <iframe
                    title="Reports"
                    src="https://docs.google.com/forms/d/e/1FAIpQLSf9yxNEZoXYYDIPSsDTLUhgnFKr-pbFWPJNkPaTDN86oI7Sjg/viewform?embedded=true"
                    width="100%"
                    height="943px"
                    frameBorder="0"
                  >
                    <CircularProgress />
                  </iframe>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardHeader title="Ansvarlige" />
                <CardContent>
                  <List dense>
                    {responsibles.map((responsible) => (
                      <ListItem key={responsible.id}>
                        <ListItemAvatar>
                          <Avatar style={{ backgroundColor: responsible.color }}>
                            <Typography variant="body2">{responsible.initials}</Typography>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={responsible.name} secondary={`${responsible.year}. klasse`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ReportsPage;
