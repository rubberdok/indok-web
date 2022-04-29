import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { BoardMember } from "./types";

type Props = {
  member: BoardMember;
};

const MemberCard: React.VFC<Props> = ({ member }) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title={member.name} />
      <CardContent>
        <Typography variant="body1" component="p">
          {member.position}
        </Typography>
        <Typography variant="body1" component="p">
          E-post: <a href={`mailto:${member.email}`}>{member.email}</a>
        </Typography>
        <Typography variant="body1" component="p">
          Tlf: {member.phone}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
