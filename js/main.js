document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const mainContainer = document.getElementById('main-container');
  const pokedexGrid = document.getElementById('pokedex-grid');
  const searchBar = document.getElementById('search-bar');
  const pokemonDetailsSection = document.getElementById('pokemon-details');
  const pokemonImage = document.getElementById('pokemon-image');
  const pokemonName = document.getElementById('pokemon-name');
  const pokemonDescription = document.getElementById('pokemon-description');
  const backToListButton = document.getElementById('back-to-list');
  const pokemonEvolutionSection = document.getElementById('pokemon-evolution');
  const evolutionChainDiv = document.getElementById('evolution-chain');
  const pokemonTcgDiv = document.getElementById('pokemon-tcg');
  const quizSection = document.getElementById('pokemon-quiz');
  const startQuizButton = document.getElementById('start-quiz');
  const quizContent = document.getElementById('quiz-content');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const submitAnswerButton = document.getElementById('submit-answer');

  let currentQuizQuestion = null;

  const createPokemonCard = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('p-4', 'bg-white', 'rounded', 'shadow', 'cursor-pointer', 'hover:bg-gray-100', 'focus:bg-gray-100', 'transition', 'duration-300');
    card.id = `pokemon-${pokemon.id}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', pokemon.name);

    const imgElement = document.createElement('img');
    imgElement.src = pokemon.sprites.front_default;
    imgElement.alt = pokemon.name;
    imgElement.classList.add('w-full', 'rounded', 'mb-2');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('text-xl', 'font-semibold', 'mb-2', 'text-indigo-600');
    titleElement.textContent = pokemon.name;

    card.appendChild(imgElement);
    card.appendChild(titleElement);
    pokedexGrid.appendChild(card);

    card.addEventListener('click', () => {
      showPokemonDetails(pokemon);
    });

    card.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        showPokemonDetails(pokemon);
      }
    });

    gsap.from(card, { duration: 1, opacity: 0 });
  };

  const loadPokemon = (id) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => createPokemonCard(data))
      .catch(error => console.error('Error fetching Pokemon data:', error));
  };

  const showPokemonDetails = (pokemon) => {
    pokemonDetailsSection.classList.remove('hidden');
    pokedexGrid.classList.add('hidden');
    pokemonImage.src = pokemon.sprites.other['official-artwork'].front_default;
    pokemonName.textContent = pokemon.name;
    pokemonDescription.innerHTML = `
      <strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}<br>
      <strong>Weight:</strong> ${pokemon.weight} hectograms<br>
      <strong>Height:</strong> ${pokemon.height} decimetres<br>
      <strong>Base Experience:</strong> ${pokemon.base_experience}
    `;

    loadPokemonTcg(pokemon.name);
    loadEvolutionChain(pokemon.id);

    gsap.from(pokemonDetailsSection, { duration: 1, y: 50, opacity: 0 });
    backToListButton.focus();
  };

  const loadPokemonTcg = (name) => {
    fetch(`https://api.pokemontcg.io/v2/cards?q=name:${name}`)
      .then(response => response.json())
      .then(data => {
        pokemonTcgDiv.innerHTML = '<h3 class="text-xl font-semibold mb-2">Trading Cards</h3>';
        data.data.forEach(card => {
          const cardImg = document.createElement('img');
          cardImg.src = card.images.small;
          cardImg.alt = card.name;
          cardImg.classList.add('w-24', 'h-32', 'inline-block', 'm-2', 'rounded');
          pokemonTcgDiv.appendChild(cardImg);
        });
      })
      .catch(error => console.error('Error fetching Pokemon TCG data:', error));
  };

  const loadEvolutionChain = (id) => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
      .then(response => response.json())
      .then(speciesData => {
        fetch(speciesData.evolution_chain.url)
          .then(response => response.json())
          .then(evolutionData => {
            displayEvolutionChain(evolutionData.chain);
          })
          .catch(error => console.error('Error fetching evolution chain data:', error));
      })
      .catch(error => console.error('Error fetching species data:', error));
  };

  const displayEvolutionChain = (chain) => {
    evolutionChainDiv.innerHTML = '<h3 class="text-xl font-semibold mb-2">Evolution Chain</h3>';
    const createEvolutionStep = (evolutionStep) => {
      const stepDiv = document.createElement('div');
      stepDiv.classList.add('inline-block', 'm-2', 'text-center');

      const imgElement = document.createElement('img');
      imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionStep.species.url.split('/')[6]}.png`;
      imgElement.alt = evolutionStep.species.name;
      imgElement.classList.add('w-24', 'h-24', 'rounded', 'mx-auto');

      const nameElement = document.createElement('p');
      nameElement.classList.add('text-sm', 'font-semibold');
      nameElement.textContent = evolutionStep.species.name;

      stepDiv.appendChild(imgElement);
      stepDiv.appendChild(nameElement);
      evolutionChainDiv.appendChild(stepDiv);

      if (evolutionStep.evolves_to.length > 0) {
        const arrowElement = document.createElement('i');
        arrowElement.classList.add('fas', 'fa-arrow-right', 'text-xl', 'mx-4', 'my-auto');
        evolutionChainDiv.appendChild(arrowElement);
        createEvolutionStep(evolutionStep.evolves_to[0]);
      }
    };

    createEvolutionStep(chain);
  };

  const hidePokemonDetails = () => {
    pokemonDetailsSection.classList.add('hidden');
    pokemonEvolutionSection.classList.add('hidden');
    pokedexGrid.classList.remove('hidden');
    searchBar.focus();
  };

  backToListButton.addEventListener('click', hidePokemonDetails);

  for (let i = 1; i <= 151; i++) {
    loadPokemon(i);
  }

  searchBar.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const pokemonCards = pokedexGrid.querySelectorAll('div[id^="pokemon-"]');
    pokemonCards.forEach(card => {
      const pokemonName = card.querySelector('h3').textContent.toLowerCase();
      if (pokemonName.includes(searchTerm)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  const startQuiz = () => {
    startQuizButton.classList.add('hidden');
    quizContent.classList.remove('hidden');
    loadQuizQuestion();
  };

  const loadQuizQuestion = () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        const randomPokemon = data.results[Math.floor(Math.random() * data.results.length)];
        fetch(randomPokemon.url)
          .then(response => response.json())
          .then(pokemonData => {
            currentQuizQuestion = pokemonData;
            displayQuizQuestion(pokemonData);
          })
          .catch(error => console.error('Error fetching Pokemon data for quiz:', error));
      })
      .catch(error => console.error('Error fetching Pokemon list for quiz:', error));
  };

  const displayQuizQuestion = (pokemon) => {
    quizQuestion.textContent = `What type is ${pokemon.name}?`;
    quizOptions.innerHTML = '';

    const correctAnswer = pokemon.types.map(type => type.type.name).join(', ');
    const wrongAnswers = ['fire', 'water', 'grass', 'electric', 'psychic', 'rock', 'ground', 'bug', 'ghost', 'dark', 'steel', 'dragon', 'fairy']
      .filter(type => !correctAnswer.includes(type))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    options.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.textContent = option;
      optionButton.classList.add('mt-2', 'px-4', 'py-2', 'bg-gray-200', 'text-gray-800', 'rounded', 'w-full', 'hover:bg-gray-300');
      optionButton.addEventListener('click', () => {
        document.querySelectorAll('#quiz-options button').forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
        optionButton.classList.add('bg-blue-500', 'text-white');
        submitAnswerButton.classList.remove('hidden');
        submitAnswerButton.dataset.answer = option;
      });
      quizOptions.appendChild(optionButton);
    });
  };

  const submitAnswer = () => {
    const selectedAnswer = submitAnswerButton.dataset.answer;
    const correctAnswer = currentQuizQuestion.types.map(type => type.type.name).join(', ');

    if (selectedAnswer === correctAnswer) {
      alert('Correct!');
    } else {
      alert(`Incorrect! The correct answer is ${correctAnswer}.`);
    }

    loadQuizQuestion();
    submitAnswerButton.classList.add('hidden');
  };

  startQuizButton.addEventListener('click', startQuiz);
  submitAnswerButton.addEventListener('click', submitAnswer);

  const images = document.querySelectorAll('img');
  images.forEach(image => {
    image.style.opacity = '0';
    image.onload = () => {
      gsap.to(image, { duration: 1, opacity: 1 });
    };
  });
});
