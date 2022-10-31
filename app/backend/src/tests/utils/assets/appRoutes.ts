export const PUBLIC_ROUTES: {
  method: "get" | "post" | "patch";
  route: string;
}[] = [
  {
    method: "post",
    route: "/login",
  },
  {
    method: "get",
    route: "/login/validate",
  },
  {
    method: "get",
    route: "/teams",
  },
  {
    method: "get",
    route: "/teams/1",
  },
  {
    method: "get",
    route: "/matches",
  },
  // {
  //     method: 'get',
  //     route: '/matches/1',
  // },
  {
    method: "get",
    route: "/leaderboard",
  },
  {
    method: "get",
    route: "/leaderboard/home",
  },
  {
    method: "get",
    route: "/leaderboard/away",
  },
];

export const PRIVATE_ROUTES: {
  method: "get" | "post" | "patch";
  route: string;
}[] = [
  {
    method: "post",
    route: "/matches",
  },
  {
    method: "patch",
    route: "/matches/1",
  },
  {
    method: "patch",
    route: "/matches/1/finish",
  },
];
