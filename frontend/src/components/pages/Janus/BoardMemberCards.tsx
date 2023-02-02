import { Box, Card, CardActionArea, CardMedia } from "@mui/material";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  display: "flex",
  height: "180px",
  flexDirection: "column",
  justifyContent: "space-between",
  textAlign: "center",
  padding: theme.spacing(2, 3),
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  height: "100px",
  width: "100%",
  backgroundSize: "contain",
  backgroundPosition: "center",
  alignContent: "center",
}));
