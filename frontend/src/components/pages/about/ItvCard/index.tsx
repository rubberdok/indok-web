import { Card, CardHeader, CardContent, Typography } from "@mui/material";

import { Link } from "@/components";

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
          E-post: <Link href={`mailto:${member.email}`}>{member.email}</Link>
        </Typography>
      </CardContent>
    </Card>
  );
};
