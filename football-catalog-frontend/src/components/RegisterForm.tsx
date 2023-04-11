import PlayerForm from './PlayerForm';

const RegisterForm = () => {
  const endpoint = '/api/Players/Create';

  return (
    <section className='App-section Register-form'>
      <h2 className='App-header'>
        Добавление футболиста
      </h2>
      <PlayerForm endpoint={endpoint} />
    </section>
  );
};

export default RegisterForm;
