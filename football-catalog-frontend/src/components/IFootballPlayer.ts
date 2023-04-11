import { Country } from "./Country";
import { Gender } from "./Gender";
import { IFootballTeam } from "./IFootballTeam";

export interface IFootballPlayer {
  id?: number;
  name: string;
  lastName: string;
  gender: Gender;
  birthday: string;
  teamId: number;
  team?: IFootballTeam;
  country: Country;
}
