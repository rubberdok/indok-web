
import { Box, Card, Container, Grid, Typography } from "@mui/material"


function BlogPage({ params }: { params: { id: number } }) {

    const title = "Tittel"
    const content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, corporis repudiandae sunt doloremque tenetur distinctio voluptatum nemo quis. Commodi, eligendi officiis repudiandae optio veniam reprehenderit culpa quos quidem rerum saepe."
    const date = "6969-69-69"
    const author = "Stephen Hawking"
    const img = "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"

    const id = params.id

    return (<Container sx={{ width: "900px", maxWidth: "90vw" }}>

        <Grid container direction={"row"}>
            
            <Grid display="flex" justifyContent={"center"} sx={{width: "100%"}}>
                <Box sx={{ width: "70%", borderRadius: "8px" }}>
                <Typography variant="h2" textAlign={"center"}>
                    {title}
                </Typography>
                </Box>
            </Grid>
            
            <Grid display="flex" sx={{ alignItems: "center", justifyContent: "center" }}>
                <Box component={"img"} alt={"T"} src={img} sx={{ width: "70%", borderRadius: "8px" }} />
            </Grid>
            
            <Grid>
                {content}
            </Grid>

        </Grid>

    </Container>)

}


export default BlogPage;