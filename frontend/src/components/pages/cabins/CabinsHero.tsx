import React from "react";

import { Title } from "@/components/Title";
import cabin from "~/public/img/hytte.jpg";

export const CabinsHero: React.VFC = () => {
  return (
    <Title
      title="Hyttebooking"
      variant="dark"
      breadcrumbs={[
        { href: "/", name: "Hjem" },
        { href: "/cabins", name: "Hyttebooking" },
      ]}
      bgImage={cabin}
    />
  );
};
