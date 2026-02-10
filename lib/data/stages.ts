export interface Stage {
  id: string;
  name: string;
  lineup: string[];
}

export const allStages: Stage[] = [
  { id: "kinetic", name: "Kinetic Field", lineup: [] },
  { id: "circuit", name: "Circuit Grounds", lineup: [] },
  { id: "cosmic", name: "Cosmic Meadow", lineup: [] },
  { id: "basspod", name: "Basspod", lineup: [] },
  { id: "waste", name: "Wasteland", lineup: [] },
  { id: "neon", name: "Neon Garden", lineup: [] },
  { id: "quantum", name: "Quantum Valley", lineup: [] },
  { id: "stereo", name: "Stereo Bloom", lineup: [] },
  { id: "bionic", name: "Bionic Jungle", lineup: [] },
  { id: "artcar", name: "Art Car", lineup: [] },
];

export function cleanLineupData(userData: Stage[]): Stage[] {
  return allStages.map((stage) => {
    const userStage = userData.find((s) => s.id === stage.id);
    return {
      ...stage,
      lineup: userStage?.lineup ?? [],
    };
  });
}

export const mockStages: Stage[] = [
  {
    id: "kinetic",
    name: "Kinetic Field",
    lineup: [
      "Tiesto",
      "Armin Van Buuren",
      "Zedd",
      "Martin Garrix",
      "David Guetta",
    ],
  },
  {
    id: "circuit",
    name: "Circuit Grounds",
    lineup: ["Subtronics", "Seven Lions", "John Summit"],
  },
  {
    id: "cosmic",
    name: "Cosmic Meadow",
    lineup: [
      "Kaskade",
      "Illenium",
      "Alesso",
      "Said The Sky",
      "Porter Robinson",
      "Madeon",
      "ODESZA",
      "San Holo",
      "Gryffin",
      "Dabin",
    ],
  },
  {
    id: "basspod",
    name: "Basspod",
    lineup: [
      "Excision",
      "Sullivan King",
      "Wooli",
      "Marauda",
      "Svdden Death",
      "Kai Wachi",
      "Dion Timmer",
      "Subtronics",
      "Barely Alive",
      "Virtual Riot",
    ],
  },
  {
    id: "quantum",
    name: "Quantum Valley",
    lineup: ["Giuseppe Ottaviani", "Andrew Bayer", "Ilan Bluestone"],
  },
  {
    id: "neon",
    name: "Neon Garden",
    lineup: ["Charlotte de Witte", "Amelie Lens", "ANNA"],
  },
  { id: "stereo", name: "Stereobloom", lineup: [] },
];
