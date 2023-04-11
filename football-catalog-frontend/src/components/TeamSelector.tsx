import React, { ReactElement, useCallback, useEffect } from "react";
import { useRef, useState } from "react";
import axios from "../axios";
import { IFootballTeam } from './IFootballTeam';
import './TeamSelector.scss';

interface ITeamSelectorProps {
  onSelect: (team?: IFootballTeam) => void;
  defaultValue?: IFootballTeam;
}

const maxTeams = 8;

const TeamSelector = ({ onSelect, defaultValue }: ITeamSelectorProps) => {
  const [teams, setTeams] = useState<IFootballTeam[]>([]);
  const [activeTeam, setActiveTeam] = useState(defaultValue?.name ?? '');
  const [show, setShow] = useState(false);
  const [userInput, setUserInput] = useState(defaultValue?.name ?? '');
  const [error, setError] = useState('');

  const fetchTeams = useCallback(async () => {
    if (userInput) {
      try {
        const { data } = await axios.get(`/api/Teams/Search/?pattern=${userInput}&maxCount=${maxTeams}`, {
          headers: {
            Accept: 'application/json',
          }
        });

        setTeams(data);
        setShow(true);
        for (let team of data) {
          if (team.name === userInput) {
            selectTeam(team);
          }
          if (team.name === activeTeam) {
            setShow(false);
          }
        }

        setError('');
      } catch (err) {
        setTeams([]);
        setError((err as Error).message);
        console.error(err);
      }
    }
  }, [userInput]);

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(fetchTeams, 200);
    return () => clearTimeout(timeout);
  }, [fetchTeams]);

  const field = useRef<HTMLInputElement>(null);

  const selectTeam = (team: IFootballTeam) => {
    onSelect(team);
    setActiveTeam(team.name);
    setUserInput(team.name);
  };

  const itemClicked = (team: IFootballTeam) => {
    selectTeam(team);
    setShow(false);
  };

  const inputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setActiveTeam('');
    onSelect();
  };

  const createTeam = async (name: string) => {
    const { data } = await axios.post(`/api/Teams/Create/?teamName=${name}`);

    setUserInput(name);
    itemClicked({ id: data, name });
  };

  let suggestionsList: ReactElement | null = null;

  if (userInput && show) {
    suggestionsList =
      (<>
        <ul
          className={teams.length ? 'Suggestions' : 'Hidden'}>
          {!activeTeam &&
            <li key={userInput} onClick={e => {
              e.preventDefault();
              createTeam(userInput);
            }}>
              Создать команду &laquo;{userInput}&raquo;
            </li>}
          {teams.map(team => {
            return (
              <li className={team.name === activeTeam ? 'Suggestion-active' : ''}
                key={team.name}
                onClick={() => itemClicked(team)}>
                {team.name}
              </li>
            );
          })}
        </ul>
        <em className={teams.length == 0 ? '' : 'Hidden'}>
          {error !== ''
            ? <>Не удалось получить список команд: {error}</>
            : <>По запросу &laquo;{userInput}&raquo; не найдено ни одной команды, но вы можете&nbsp;
              <a onClick={e => {
                e.preventDefault();
                createTeam(userInput);
              }}>создать новую</a>
            </>}
        </em>
      </>
      );
  }

  return (
    <>
      <input type='text'
        value={userInput}
        className='Form-item'
        required
        autoComplete='off'
        name='team'
        onChange={inputChanged}
        ref={field}
        placeholder='Название команды' />
      {suggestionsList}
    </>
  );
};

export default TeamSelector;
