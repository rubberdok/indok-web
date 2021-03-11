import { Organization } from "@interfaces/listings"
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar
} from "@material-ui/core"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

interface InlineOrganizationInfoPanelProps {
  organization: Organization
}


const InlineOrganizationInfoPanel: React.FC<InlineOrganizationInfoPanelProps> = ({ organization }) => {

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="organization-info"
        id="organization-info"
      >
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={4}>
          <Grid item>
            <Avatar variant="square" src={organization.color || "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"} alt="Organization logo"/>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="h3">
              {organization.name}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails variant="body1" component="span">
        {organization.description}
      </AccordionDetails>
    </Accordion>
    
  )
};

export default InlineOrganizationInfoPanel;