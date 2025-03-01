import { useCallback, useEffect, useState } from "react";
import axios from "../api/axios";
import { IFootballPlayer } from "./IFootballPlayer";
import '../assets/style/PlayersList.scss';
import PlayerForm from "./PlayerForm";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { getCountryName } from "./Country";
import { Gender } from "./Gender";

const connection = new HubConnectionBuilder()
  .withUrl(`${process.env.REACT_APP_API_URI}/PlayersHub`)
  .build();

const PlayersList = () => {
  const editEndpoint = '/Players/Update';

  const [players, setPlayers] = useState<IFootballPlayer[]>([]);
  const [error, setError] = useState('');
  const [editedId, setEditedId] = useState(0);

  const fetchPlayers = useCallback(async () => {
    try {
      const { data } = await axios.get(`/Players/Get`, {
        headers: {
          Accept: 'application/json',
        }
      });

      console.log('fetched players');
      setPlayers(data);
      setError('');

      if (connection.state === HubConnectionState.Disconnected) {
        connection.start();
      }
    } catch (err) {
      setPlayers([]);
      setError((err as Error).message);
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const addPlayer = (p: IFootballPlayer) => {
    let newPlayers = [...players, p];
    newPlayers.sort((a, b) => a.name.localeCompare(b.name));
    setPlayers(newPlayers);
  };

  const updatePlayer = (p: IFootballPlayer) => {
    const idx = players.findIndex(player => player.id === p.id);
    let newPlayers = [...players];
    newPlayers[idx] = p as IFootballPlayer;
    newPlayers.sort((a, b) => a.name.localeCompare(b.name));
    setPlayers(newPlayers);
  };

  useEffect(() => {
    connection.on('PlayerAdded', addPlayer);
    connection.on('PlayerUpdated', updatePlayer);
  });

  return (
    <section className='App-section'>
      <h2 className='App-header'>
        Список футболистов
      </h2>
      <em className={!error ? 'Hidden' : ''}>
        Не удалось получить список футболистов: {error}
      </em>
      <table className={error === '' ? 'List-table' : 'Hidden'}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Пол</th>
            <th>Дата рождения</th>
            <th>Команда</th>
            <th>Страна</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => {
            const { name, lastName, team } = player;
            const country = getCountryName(player.country);
            const gender = player.gender === Gender.Male ? 'Муж' : 'Жен';
            const birthday = new Date(player.birthday).toLocaleDateString();

            return (
              <>
                <tr key={player.id}>
                  <td className='Name' title={name}>{name}</td>
                  <td className='Name' title={lastName}>{lastName}</td>
                  <td title={gender}>{gender}</td>
                  <td title={birthday}>{birthday}</td>
                  <td className='Name' title={team?.name}>{team?.name}</td>
                  <td title={country}>{country}</td>
                  <td><a onClick={() => editedId === player.id
                    ? setEditedId(0)
                    : setEditedId(player.id!)}>
                    &#9998;
                  </a>
                  </td>
                </tr>
                {editedId === player.id &&
                  (<tr key={`${player.id}-editor`}>
                    <td className='Editor' colSpan={7}>
                      <PlayerForm endpoint={editEndpoint} defaultValues={player} />
                    </td>
                  </tr>)}
              </>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default PlayersList;
