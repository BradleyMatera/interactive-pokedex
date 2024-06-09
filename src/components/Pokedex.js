import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonDetails from './PokemonDetails';
import './Pokedex.css';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      setPokemonList(response.data.results);
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pokedex">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="pokemon-list">
        {filteredPokemonList.map((pokemon, index) => (
          <div
            key={index}
            role="button"
            className="pokemon-card"
            onClick={() => setSelectedPokemon(pokemon)}
            onKeyPress={(e) => { if (e.key === 'Enter') setSelectedPokemon(pokemon); }}
            tabIndex="0"
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`} alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
      {selectedPokemon && (
        <PokemonDetails
          selectedPokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
};

export default Pokedex;
