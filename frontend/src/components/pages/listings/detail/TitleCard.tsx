import { Grid, Hidden, Card, CardContent } from "@material-ui/core";

/**
 * component for title and organization info on the listing detail page
 * props: the listing to render
 */
interface TitleCardProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
}

const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, action }) => {
  return (
      <Card style={{height: "100%"}}>
        <CardContent>
          <Grid container direction="column" justify="space-between" alignItems="center">
            <Grid item>
              {title}
            </Grid>
            {subtitle &&
              <Grid item>
                {subtitle}
              </Grid>
            }
            {action &&  
              <Hidden xsDown>
                <Grid item>
                  {action}
                </Grid>
              </Hidden>
            }
          </Grid>
        </CardContent>
      </Card>
  );
};

export default TitleCard;
