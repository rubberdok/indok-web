import { IntegrationTestProps } from "./ProfileCardBase";
import Link from "next/link";
import { CardActions, Typography, Box } from "@material-ui/core";

type Props = {
  actionText: string;
  actionLink?: string;
};

const ProfileActionBase: React.VFC<Props & IntegrationTestProps> = ({ actionLink, ...props }) =>
  actionLink ? (
    <Link passHref href={actionLink}>
      <ActionText {...props} />
    </Link>
  ) : (
    <Box fontStyle="italic">
      <ActionText {...props} />
    </Box>
  );
export default ProfileActionBase;

const ActionText: React.VFC<Pick<Props, "actionText"> & IntegrationTestProps> = ({
  actionText,
  "data-test-id": dataTestId,
}) => (
  <CardActions data-test-id={`${dataTestId}link`}>
    <Typography variant="overline" color="textPrimary">
      {actionText}
    </Typography>
  </CardActions>
);
