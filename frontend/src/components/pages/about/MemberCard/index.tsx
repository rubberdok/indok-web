import { Card, CardContent, CardHeader, Typography } from "@mui/material";

import { Link } from "@/components";

import { BoardMember } from "./types";

type Props = {
  member: BoardMember;
};

export const MemberCard: React.VFC<Props> = ({ member }) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title={member.name} />
      <CardContent>
        <Typography variant="body1" component="p">
          {member.position}
        </Typography>
        <Typography variant="body1" component="p">
          E-post: <Link href={`mailto:${member.email}`}>{member.email}</Link>
        </Typography>
        {member.phone && (
          <Typography variant="body1" component="p">
            Tlf: {member.phone}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
