import { ProfileActionProps } from "./ProfileCardBase";
import Link from "next/link";
import { CardActions, Typography } from "@material-ui/core";

type Props = {
  text: string;
  link: string;
};

/**
 * Function that returns a functional component for use as a profile card action.
 * The outer function takes the props not required by the card action.
 * The inner function takes the remaining props as required for the card action.
 *
 * This function takes a text and a link, and returns a card action
 * with the text leading to the link.
 */
const createLinkProfileAction =
  ({ text, link }: Props): React.VFC<ProfileActionProps> =>
  ({ "data-test-id": dataTestId }) =>
    (
      <Link passHref href={link}>
        <CardActions data-test-id={`${dataTestId}link`}>
          <Typography variant="overline" color="textPrimary">
            {text}
          </Typography>
        </CardActions>
      </Link>
    );
export default createLinkProfileAction;
