import { IFootballTeam } from "./IFootballTeam";

export interface IFootballPlayer {
  id?: number;
  name: string;
  lastName: string;
  gender: number;
  birthday: string;
  teamId: number;
  team?: IFootballTeam;
  country: number;
}
