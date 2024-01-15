"use client";

import { Container, Grid, List, Box, Card, Typography, ButtonBase } from "@mui/material";

function Post({
    image,
    author,
    title,
    date,
    intro,
    id,
}: {
    image: string;
    author: string;
    title: string;
    date: string;
    intro: string;
    id: string;
}) {
    return (
        <ButtonBase
            onClick={() => {
        window.location.href = "blog/" + id;
            }}
        >
            <Card
                sx={{
                    margin: "5px",
                    padding: "10px",
                    boxShadow: 1,
                    bgcolor: "primary",
                    "&:hover": {
                        bgcolor: "rgba(127,127,127,0.10)",
                    },
                }}
            >
                <Grid container direction={"column"}>
                    <Grid container item direction={"row"}>
                        <Grid item md={8}>
                            <Typography sx={{ fontSize: "20px", marginTop: "10px" }}>{title}</Typography>
                        </Grid>

                        <Grid item md={4}>
                            <Typography
                                sx={{
                                    fontStyle: "italic",
                                    fontSize: "14px",
                                    textAlign: "right",
                                    marginRight: "20px",
                                    marginTop: "10px",
                                }}
                            >
                                Skrevet av {author}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item md={1}>
                        <Typography sx={{ fontSize: "12px", marginBottom: "15px", textAlign: "left" }}>{date}</Typography>
                    </Grid>

                    <Grid container item direction={"row"}>
                        <Grid item md={5}>
                            <Box component={"img"} alt={"T"} src={image} sx={{ width: "100%", borderRadius: "8px" }} />
                        </Grid>

                        <Grid item md={6} sx={{ marginLeft: "20px" }}>
                            <Typography sx={{ textAlign: "center" }}>{intro}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </ButtonBase>
    );
}

function posts() {
    return [
        <Post
            image="https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcRoT6NNDUONDQmlthWrqIi_frTjsjQT4UZtsJsuxqxLiaFGNl5s3_pBIVxS6-VsFUP_"
            author="John Doe"
            title="Utforskning av Dyreliv i Amazonas"
            date="2023-11-06"
            intro="Lorem ipsum dolor sit amet consectetur adipisicing elit. A sed cupiditate accusamus ab ipsam, consequuntur natus non facere magnam modi eos unde quos in impedit iste recusandae quasi. Pariatur, natus?"
            id="1"
        ></Post>,
        <Post
            image="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg"
            author="Alice Smith"
            title="Klimaendringer og Bærekraftig Fremtid"
            date="2023-11-05"
            intro="Lorem ipsum dolor sit amet consectetur adipisicing elit. A sed cupiditate accusamus ab ipsam, consequuntur natus non facere magnam modi eos unde quos in impedit iste recusandae quasi. Pariatur, natus?"
            id="blog2"
        ></Post>,
        <Post
            image="https://www.thesprucepets.com/thmb/17UY4UpiMekV7WpeXDziXsnt7q4=/1646x0/filters:no_upscale():strip_icc()/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg"
            author="Michael Johnson"
            title="Teknologiske Fremskritt og Samfunnet"
            date="2023-11-04"
            intro="Lorem ipsum dolor sit amet consectetur adipisicing elit. A sed cupiditate accusamus ab ipsam, consequuntur natus non facere magnam modi eos unde quos in impedit iste recusandae quasi. Pariatur, natus?"
            id="blog3"
        ></Post>,
        <Post
            image="https://media.licdn.com/dms/image/C5605AQHYp9y8nAYsag/videocover-low/0/1637699206651?e=2147483647&v=beta&t=yfchspjYQQ2GtEN4Wpp8P_nb94TK8ExVOOa8iPfBmvI"
            author="Emily Brown"
            title="Kunst og Kultur i Moderne Samfunn"
            date="2023-11-03"
            intro="Lorem ipsum dolor sit amet consectetur adipisicing elit. A sed cupiditate accusamus ab ipsam, consequuntur natus non facere magnam modi eos unde quos in impedit iste recusandae quasi. Pariatur, natus?"
            id="blog4"
        ></Post>,
    ];
}

function Blog() {
    return (
        <Container sx={{ width: "900px", maxWidth: "90vw" }}>
            <List>{posts()}</List>
        </Container>
    );
}

export default Blog;
