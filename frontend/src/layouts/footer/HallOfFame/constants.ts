type Member = {
  name: string;
  class: number;
  position?: string;
};

export const rubberdokMembers: Record<string, Member[]> = {
  "2024/2025": [
    { name: "Hannah Köberle", class: 2, position: "Prosjektleder" },
    { name: "Magnus Hafstad", class: 4, position: "Veteran" },
    { name: "Thomas Falkeid Hagland", class: 3 },
    { name: "Torgeir Keun Lysen", class: 3 },
    { name: "Frederik Egelund Edvardsen", class: 3 },
    { name: "Andreas Tauge", class: 2 },
    { name: "Kristian Tveråmo Aastveit", class: 3 },
  ],
  "2023/2024": [
    { name: "Magnus Hafstad", class: 3, position: "Prosjektleder" },
    { name: "Hannah Köberle", class: 1, position: "Prosjektleder" },
    { name: "Thomas Falkeid Hagland", class: 2 },
    { name: "Torgeir Keun Lysen", class: 2 },
    { name: "Frederik Egelund Edvardsen", class: 2 },
    { name: "Andreas Tauge", class: 1 },
    { name: "Kristian Tveråmo Aastveit", class: 2 },
  ],
  "2022/2023": [
    { name: "Simen Sandhaug", class: 1, position: "Prosjektleder" },
    { name: "Magnus Hafstad", class: 2, position: "Prosjektleder" },
    { name: "Lars Ivar Skårset", class: 2 },
    { name: "Torger Skrettingland", class: 2 },
    { name: "Camilla Toftum Hop", class: 1 },
    { name: "Thomas Falkeid Hagland", class: 1 },
    { name: "Torgeir Keun Lysen", class: 1 },
    { name: "Thomas Myrseth", class: 1 },
    { name: "Fannar Steinn Lindal Rafnsson", class: 2 },
  ],
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
