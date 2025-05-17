// src/mocks/mockTransfers.js
export const mockTransfers = [
  {
    player: {
      id: 123,
      name: "E. Haaland"
    },
    transfers: [
      {
        date: "2019-01-01",
        teams: {
          in: {
            name: "Red Bull Salzburg",
            logo: "https://media.api-sports.io/football/teams/250.png"
          }
        }
      },
      {
        date: "2020-01-01",
        teams: {
          in: {
            name: "Borussia Dortmund",
            logo: "https://media.api-sports.io/football/teams/165.png"
          }
        }
      },
      {
        date: "2022-07-01",
        teams: {
          in: {
            name: "Manchester City",
            logo: "https://media.api-sports.io/football/teams/50.png"
          }
        }
      }
    ]
  }
];
