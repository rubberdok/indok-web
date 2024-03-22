import { Link } from "@/app/components/Link";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

type ItvMember = {
  rank: number;
  name: string;
  email: string;
};

type Props = {
  member: ItvMember;
};

function ItvCard({ member }: Props) {
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
}

export { ItvCard };
export type { ItvMember };
