import { useRef, useState, useEffect } from 'react';
import './PlayerForm.scss';
import axios from '../axios';
import TeamSelector from './TeamSelector';
import { IFootballPlayer } from './IFootballPlayer';
import countries from './Countries';

interface IPlayerFormProps {
  endpoint: string;
  defaultValues?: IFootballPlayer;
}

const PlayerForm = ({ endpoint, defaultValues }: IPlayerFormProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  defaultValues ??= {
    id: 0,
    name: '',
    lastName: '',
    gender: 0,
    birthday: '',
    teamId: 0,
    country: 0
  };

  const [playerData, setPlayerData] = useState(defaultValues);

  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
    console.log(defaultValues?.birthday);
  }, []);

  useEffect(() => {
    setErrorMessage('');
    setShowSuccess(false);
  }, [playerData]);

  const validateForm = () => {
    if (!playerData.team) {
      setErrorMessage('Укажите команду');
      return false;
    }

    const name_re = /^[\p{L}'\-]{1,64}$/u;
    const {name, lastName} = playerData;
    if (!name_re.test(name) || !name_re.test(lastName)) {
      setErrorMessage('Имя и фамилия должны быть не длиннее 64 символов, содержать только буквы и знаки: \' и -');
      return false;
    }

    return true;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      errorRef.current?.scrollIntoView();
      return;
    }

    const requestObject: IFootballPlayer = {
      ...playerData,
      teamId: playerData.team?.id!,
      team: undefined
    };

    try {
      const { data } = await axios.post(endpoint, requestObject);
      console.log(`Created a player with ID = ${data}`);
      formRef.current?.reset();
      setShowSuccess(true);
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).message);
    }

    if (errorMessage !== '') {
      errorRef.current?.scrollIntoView();
    }
  };

  return (
    <form onSubmit={submit} ref={formRef}>
      <fieldset className='Form-fieldset'>
        <legend>Имя:</legend>
        <input type='text'
          className='Form-item'
          value={playerData.name}
          onChange={(e) => setPlayerData({...playerData, name: e.target.value})}
          autoComplete='off'
          required
          name='name'
          placeholder='Имя'
          ref={nameRef} />
      </fieldset>
      <fieldset className='Form-fieldset'>
        <legend>Фамилия:</legend>
        <input type='text'
          className='Form-item'
          value={playerData.lastName}
          onChange={(e) => setPlayerData({...playerData, lastName: e.target.value})}
          autoComplete='off'
          required
          name='lastName'
          placeholder='Фамилия' />
      </fieldset>

      <fieldset className='Form-fieldset Binary-select'>
        <legend>Пол:</legend>
        <label className='Form-radio'>
          <input type='radio'
            id='male'
            onChange={() => setPlayerData({...playerData, gender: 0})}
            name='gender'
            checked={playerData.gender === 0} />
          Мужской
        </label>
        <label className='Form-radio'>
          <input type='radio'
            id='female'
            onChange={() => setPlayerData({...playerData, gender: 1})}
            name='gender'
            checked={playerData.gender === 1}/>
          Женский
        </label>
      </fieldset>

      <fieldset className='Form-fieldset'>
        <legend>Дата рождения:</legend>
        <input type='date'
          className='Form-item'
          defaultValue={playerData.birthday}
          required
          onChange={(e) => setPlayerData({...playerData, birthday: e.target.value})}
          name='birthday' />
      </fieldset>

      <fieldset className='Form-fieldset'>
        <legend>Команда:</legend>
        <TeamSelector onSelect={(team) => setPlayerData({...playerData, team})} defaultValue={defaultValues?.team} />
      </fieldset>

      <fieldset className='Form-fieldset'>
        <legend>Страна:</legend>
        <select name="country"
          className='Form-item'
          value={playerData.country}
          onChange={(e) => setPlayerData({...playerData, country: Number.parseInt(e.target.value)})}>
          {countries.map((c, i) => (
            <option value={i}>{c}</option>
          ))}
        </select>
      </fieldset>

      <fieldset className='Form-fieldset'>
        <p className={errorMessage === '' ? 'Hidden' : 'Form-error'} ref={errorRef}>
          Не удалось отправить форму: {errorMessage}
        </p>
        <p className={showSuccess ? 'Form-success' : 'Hidden'}>
          Форма отправлена успешно
        </p>

        <input type='submit' value='Отправить' className='Form-item Form-button' />
      </fieldset>
    </form>
  );
};

export default PlayerForm;
