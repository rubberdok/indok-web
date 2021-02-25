import { Grid, Typography, Box } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Link from "next/link";
import React from "react";

interface HeaderCompositionProps {
  headerText: string;
  arrowOnClick?: () => void;
  href?: string;
}

const HeaderComposition: React.FC<HeaderCompositionProps> = (props) => {
  return (
    <>
      <Box p="15px">
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            {props.href ? (
              <Link href={props.href}>
                <ArrowBackIcon fontSize={"large"} />
              </Link>
            ) : (
              <ArrowBackIcon fontSize={"large"} onClick={props?.arrowOnClick} />
            )}
          </Grid>
          <Grid item>
            <Typography variant="h2">{props.headerText}</Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HeaderComposition;
