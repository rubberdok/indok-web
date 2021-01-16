import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import Navbar from "@components/navbar/Navbar";
import CreateEvent from "../../components/pages/events/createEvent";
import Button from "@components/ui/Button";

const CreateEventsPage: NextPage = () => {
  return (
    <div>
      <Navbar />
      <Button back styling="primary" link="/events">
        Tilbake til arrangementer
      </Button>
      <div
        style={{
          border: "solid",
          borderRadius: "1em",
          padding: "2em",
          backgroundColor: "#fff",
          borderColor: "#6A9997",
          width: "450px",
          margin: "0 auto",
        }}
      >
        {" "}
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <CreateEvent />
        </div>
      </div>
    </div>
  );
};

export default CreateEventsPage;
