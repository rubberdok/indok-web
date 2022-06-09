type Member = {
  name: string;
  class: number;
  position?: string;
};

export const rubberdokMembers: Record<string, Member[]> = {
  "2021/2022": [
    { name: "Lars Waage", class: 4, position: "Prosjektleder" },
    { name: "Hermann Mørkrid", class: 4, position: "Prosjektleder" },
    { name: "Morgan Heggland", class: 5 },
    { name: "Jorunn Leithe", class: 4 },
    { name: "Jørgen Rosager", class: 4 },
    { name: "Mathilde Marie Solberg", class: 4 },
    { name: "Erik Thinn Tvedt", class: 3 },
    { name: "Sebastian Cheng", class: 3 },
    { name: "Herman Holmøy", class: 2 },
    { name: "Ragnhild Bodsberg", class: 2 },
    { name: "Johan Haga Mohn", class: 1 },
  ],
  "2020/2021": [
    { name: "Morgan Heggland", class: 4, position: "Prosjektleder" },
    { name: "Lars Lien Ankile", class: 4, position: "Lederpar HS" },
    { name: "Andreas Johannesen", class: 4, position: "Lederpar HS" },
    { name: "Sverre Spetalen", class: 5 },
    { name: "Anna Sofie Lunde", class: 4 },
    { name: "Fredrik Ahlborg", class: 4 },
    { name: "Ingrid Aaseng", class: 4 },
    { name: "Patrik Kjærran", class: 4 },
    { name: "Hermann Mørkrid", class: 3 },
    { name: "Lars Waage", class: 3 },
    { name: "Mathilde Marie Solberg", class: 3 },
    { name: "Herman Holmøy", class: 1 },
    { name: "Mathias Raa", class: 1 },
  ],
};
