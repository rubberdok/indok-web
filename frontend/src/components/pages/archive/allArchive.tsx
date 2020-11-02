/* eslint-disable prettier/prettier */
import { useQuery } from "@apollo/client";
import { DOCUMENTS } from "@graphql/archive/queries";
import { ArchivedDocument } from "@interfaces/archive";
import Item from "@components/ui/Item";
import Button from "@material-ui/core/Button";
import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const areasTablet = `
    items
`;

const areasLarge = `
    items
`;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            margin: "auto",
            maxWidth: 500,
        },
        image: {
            width: 128,
            height: 128,
        },
        img: {
            margin: "auto",
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
        },
    })
);

const AllArchive: React.FC = () => {
    const { loading, error, data } = useQuery(DOCUMENTS);
    const classes = useStyles();
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
        <Grid container className={classes.root} justify="center" spacing={2}>
            <Grid item xs>
                <Grid container className={classes.img} justify="center" spacing={2}>
                    {data.allArchives.map((doc: ArchivedDocument) => (
                        <Button
                            key={doc.id}
                            onClick={() => {
                                window.open(doc.url, "_blank");
                            }}
                        >
                            <Item key={doc.id} title={doc.title} subtitle={doc.typeDoc} imageUrl={doc.thumbnail} />
                        </Button>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AllArchive;

/*
                            
     
       /* <Composition alignItems="center" areas={areasTablet} areasLg={areasLarge} gap={60} gapRow={20}>
                {(Areas) => (
                        <Areas.Items>
                            <Composition
                                templateCols="auto"
                                templateColsMd="auto auto auto auto"
                                templateColsLg="auto"
                                gap={10}
                                gapLg={15}
                            >
                                {data.allArchives.map((doc: ArchivedDocument) => (
                                    <Item
                                        key={doc.id}
                                        title={doc.title}
                                        subtitle={doc.typeDoc}
                                        imageUrl={doc.thumbnail}
                                    />
                                ))}
                          </Composition>  
                        </Areas.Items>
                        
                    )
    }
    </Composition>*/
