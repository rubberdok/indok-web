import { Card, CardContent, Grid } from "@material-ui/core"

interface InfoCardProps {
  title: React.ReactNode,
  description?: React.ReactNode,
  action?: React.ReactNode,
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, action }) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Grid container direction="column" justify="space-evenly" alignItems="center" style={{ height: "100%" }}>
          <Grid item>
            {title}
          </Grid>
          {description &&
            <Grid item>
              {description}
            </Grid>
          }
          {action &&
            <Grid item>
              {action}
            </Grid>
          }
        </Grid>
      </CardContent>
    </Card>
  )
}

export default InfoCard;