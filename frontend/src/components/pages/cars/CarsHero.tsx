import React from "react";

import { Title } from "@/components/Title";
import car from "~/public/img/hytte.jpg";

export const CarsHero: React.VFC = () => {
  return (
    <Title
      title="Bilbooking"
      variant="dark"
      breadcrumbs={[
        { href: "/", name: "Hjem" },
        { href: "/cars", name: "Hyttebooking" },
      ]}
      bgImage={car}
    />
  );
};
