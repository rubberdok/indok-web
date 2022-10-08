import { Card, CardHeader, CardContent, Typography } from "@mui/material";

import { ItvMember } from "./types";

type Props = {
  member: ItvMember;
};

export const ItvCard: React.VFC<Props> = ({ member }) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title={member.name} />
      <CardContent>
        <Typography variant="body1" component="p">
          E-post: <a href={`mailto:${member.email}`}>{member.email}</a>
        </Typography>
      </CardContent>
    </Card>
  );
};
