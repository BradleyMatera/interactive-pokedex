import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PokemonDetails.css';

const PokemonDetails = ({ selectedPokemon, onClose }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [tcgCards, setTcgCards] = useState([]);

  useEffect(() => {
    if (selectedPokemon) {
      fetchPokemonData(selectedPokemon.name);
      fetchEvolutionChain(selectedPokemon.name);
      fetchTcgCards(selectedPokemon.name);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.body.style.overflow = 'auto'; // Re-enable background scroll when closing
    };
  }, [selectedPokemon]);

  const fetchPokemonData = async (pokemonName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      setPokemonData(response.data);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  const fetchEvolutionChain = async (pokemonName) => {
    try {
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      const evolutionResponse = await axios.get(evolutionChainUrl);
      const chain = extractEvolutionChain(evolutionResponse.data.chain);
      setEvolutionChain(chain);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
    }
  };

  const extractEvolutionChain = (chain) => {
    const evoChain = [];
    let evoData = chain;

    do {
      const evoDetails = evoData['evolves_to'];
      evoChain.push({
        species_name: evoData.species.name,
        min_level: !evoDetails.length ? 1 : evoDetails[0].evolution_details[0].min_level,
        id: evoData.species.url.split('/').slice(-2, -1)[0],
      });

      evoData = evoDetails.length ? evoDetails[0] : null;
    } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

    return evoChain;
  };

  const fetchTcgCards = async (pokemonName) => {
    try {
      const response = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`);
      setTcgCards(response.data.data);
    } catch (error) {
      console.error('Error fetching TCG cards:', error);
    }
  };

  if (!pokemonData) return null;

  return (
    <div className="pokemon-details-container">
      <div className="pokemon-details">
        <button className="close-button" onClick={onClose}>Close</button>
        <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} className="pokemon-image" />
        <h2>{pokemonData.name}</h2>
        <p>Height: {pokemonData.height}</p>
        <p>Weight: {pokemonData.weight}</p>

        <div className="evolution-chain">
          <h3>Evolution Chain</h3>
          {evolutionChain.map((evo, index) => (
            <div key={index} className="evolution">
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`} alt={evo.species_name} className="evolution-image" />
              <p>{evo.species_name}</p>
            </div>
          ))}
        </div>

        <div className="tcg-cards">
          <h3>TCG Cards</h3>
          {tcgCards.map((card) => (
            <div key={card.id} className="tcg-card">
              <img src={card.images.small} alt={card.name} className="tcg-card-image" />
              <p>{card.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
