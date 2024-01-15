import { Grid } from "@mui/material"


function BlogPage({ params }: { params: { id: number} }) {

    const content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, corporis repudiandae sunt doloremque tenetur distinctio voluptatum nemo quis. Commodi, eligendi officiis repudiandae optio veniam reprehenderit culpa quos quidem rerum saepe."
    const date = "6969-69-69"
    const author = "Stephen Hawking"
    const img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nationalgeographic.com%2Fanimals%2Fmammals%2Ffacts%2Fdomestic-cat&psig=AOvVaw1K9tP4tlgA8Rw30SRwIqGK&ust=1705419919852000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKiN5rXe34MDFQAAAAAdAAAAABAI"

    const id = params.id

    return (<div>

        <Grid container direction={"row"}>

            <p>
                {content}

                {content}
            </p>

        </Grid>

    </div>)

}


export default BlogPage;