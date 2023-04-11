import { useCallback, useEffect, useState } from "react";
import axios from "../axios";
import { IFootballPlayer } from "./IFootballPlayer";
import countries from "./Countries";
import './PlayersList.scss';
import PlayerForm from "./PlayerForm";

const PlayersList = () => {
  const editEndpoint = '/api/Players/Update';

  const [players, setPlayers] = useState<IFootballPlayer[]>([]);
  const [error, setError] = useState('');
  const [editedId, setEditedId] = useState(0);

  const fetchPlayers = useCallback(async () => {
    try {
      const { data } = await axios.get(`https://localhost:7070/api/Players/Get`, {
        headers: {
          Accept: 'application/json',
        }
      });

      console.log('fetched players');
      setPlayers(data);
      setError('');
    } catch (err) {
      setPlayers([]);
      setError((err as Error).message);
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

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
            const country = countries[player.country];
            const gender = player.gender == 0 ? 'Муж' : 'Жен';
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
                  (<tr key={0}>
                    <td className='Editor' colSpan={6}>
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
