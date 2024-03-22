import { MailOutline, Phone } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";
import { notFound } from "next/navigation";

import { Markdown } from "@/app/_components/Markdown";
import { Link } from "@/app/components/Link";
import { Title } from "@/components/Title";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

import { getOrganizationData } from "../../../../_data/organizations";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { organizationData } = await import("../../../../_data/organizations");
  return organizationData.map(({ slug }) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const data = getOrganizationData({ slug: params.slug });
  if (data === null) return notFound();
  const { organization, markdown } = data;

  return (
    <>
      <Title
        title={organization.name}
        bgImage={organization.largeImage?.url ?? undefined}
        variant="dark"
        sx={{
          mt: { xs: `-${HEADER_MOBILE_HEIGHT}px`, md: `-${HEADER_DESKTOP_HEIGHT}px` },
        }}
        ImageProps={{
          placeholder: "empty",
          style: { objectPosition: "center", objectFit: "cover" },
        }}
        breadcrumbs={[
          { href: "/", name: "Hjem" },
          { href: "/about", name: "Om oss" },
          { href: "/about/organizations", name: "Våre foreninger" },
          { href: `/about/organizations/${organization.id}`, name: organization.name },
        ]}
      />

      <Container sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          <Grid xs={12} md={8}>
            <Markdown>{markdown}</Markdown>
          </Grid>
          <Grid xs={12} md={4}>
            {organization.members && (
              <Card>
                <CardHeader title="Styret" />
                <CardContent>
                  <Grid container direction="column" spacing={2}>
                    {Object.entries(organization.members).map(([key, member], index, array) => (
                      <Grid key={key}>
                        <Typography variant="body1">{member.name}</Typography>
                        <Typography variant="caption" gutterBottom>
                          {member.title}
                        </Typography>
                        <br />
                        {member.mail && (
                          <Chip
                            component={Link}
                            href={`mailto:${member.mail}`}
                            size="small"
                            label={member.mail}
                            icon={<MailOutline />}
                          />
                        )}
                        {member.mail && member.phoneNumber && <br />}
                        {member.phoneNumber && <Chip size="small" label={member.phoneNumber} icon={<Phone />} />}
                        {index < array.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
