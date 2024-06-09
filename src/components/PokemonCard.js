import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PokemonCard.css'; // Ensure this path is correct

const PokemonCard = ({ name }) => {
  const [pokemonImage, setPokemonImage] = useState('');

  useEffect(() => {
    const fetchPokemonImage = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemonImage(response.data.sprites.front_default);
      } catch (error) {
        console.error('Error fetching Pokémon image:', error);
      }
    };

    fetchPokemonImage();
  }, [name]);

  return (
    <div className="pokemon-card">
      <h3>{name}</h3>
      {pokemonImage && <img src={pokemonImage} alt={name} />}
    </div>
  );
};

export default PokemonCard;
