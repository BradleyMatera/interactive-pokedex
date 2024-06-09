import React, { useState } from 'react';
import Pokedex from './components/Pokedex';
import PokemonDetails from './components/PokemonDetails';
import './App.css';

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <div className="App">
      <h1>Interactive Pokedex</h1>
      <Pokedex onPokemonSelect={handlePokemonSelect} />
      {selectedPokemon && <PokemonDetails selectedPokemon={selectedPokemon} />}
    </div>
  );
};

export default App;
