import { Link } from "@/app/components/Link";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

type BoardMember = {
  rank: number;
  name: string;
  email: string;
  phone?: string;
  position: string;
};

type Props = {
  member: BoardMember;
};

function MemberCard({ member }: Props) {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title={member.name} />
      <CardContent>
        <Typography variant="body1" component="p">
          {member.position}
        </Typography>
        <Typography variant="body1" component="p">
          <Link href={`mailto:${member.email}`}>{member.email}</Link>
        </Typography>
        {member.phone && (
          <Typography variant="body1" component="p">
            <Link href={`tel:${member.phone}`}>{member.phone}</Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export { MemberCard };
export type { BoardMember };
