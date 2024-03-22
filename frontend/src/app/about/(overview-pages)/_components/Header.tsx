import { Divider, Stack, Typography } from "@mui/material";

type HeaderProps = {
  title: string;
  subheader: string;
};

function Header(props: HeaderProps) {
  return (
    <Stack direction="column" alignItems="center" spacing={4} width={1} mb={4}>
      <Typography textAlign="center" variant="caption" component="p">
        Om foreningen
      </Typography>
      <Typography textAlign="center" variant="h3" component="h1" gutterBottom>
        {props.title}
      </Typography>
      <Typography textAlign="center" variant="subtitle1" component="p">
        {props.subheader}
      </Typography>
      <Divider flexItem />
    </Stack>
  );
}

export { Header };
