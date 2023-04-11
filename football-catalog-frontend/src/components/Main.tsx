import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlayersList from './PlayersList';
import RegisterForm from './RegisterForm';
import Navigation from './Navigation';

const Main = () => {
  return (
    <>
      <Navigation />
      <main>
        <Routes>
          <Route path='/' element={<RegisterForm />} />
          <Route path='/list' element={<PlayersList />} />
        </Routes>
      </main>
    </>
  );
};

export default Main;
