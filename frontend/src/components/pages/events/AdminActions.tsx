import { Card, CardContent, Stack, Typography } from "@mui/material";

export const AdminActions: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <Card elevation={0} sx={{ display: { xs: "none", sm: "block" }, bgcolor: "secondary.main" }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Administrer</Typography>
            <Stack direction="row" spacing={1}>
              {children}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Stack direction="row" spacing={1} display={{ xs: "block", sm: "none" }}>
        {children}
      </Stack>
    </>
  );
};
