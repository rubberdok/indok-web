import Link from "next/link";
import { CardActions, Typography, CardActionArea } from "@material-ui/core";

type Props = {
  text: string;
  link: string;
  "data-test-id"?: string;
};

const LinkAction: React.VFC<Props> = ({ text, link, "data-test-id": dataTestId }) => {
  return (
    <CardActionArea>
      <Link passHref href={link}>
        <CardActions data-test-id={`${dataTestId}link`}>
          <Typography variant="overline" color="textPrimary">
            {text}
          </Typography>
        </CardActions>
      </Link>
    </CardActionArea>
  );
};
export default LinkAction;
