import React, { useState, useEffect } from 'react';

const Quiz = () => {
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadQuizQuestion = () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        const randomPokemon = data.results[Math.floor(Math.random() * data.results.length)];
        fetch(randomPokemon.url)
          .then(response => response.json())
          .then(pokemonData => {
            setCurrentQuizQuestion(pokemonData);
            setSelectedAnswer(null);
            setFeedback('');
          })
          .catch(error => console.error('Error fetching Pokemon data for quiz:', error));
      })
      .catch(error => console.error('Error fetching Pokemon list for quiz:', error));
  };

  useEffect(() => {
    loadQuizQuestion();
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const correctAnswer = currentQuizQuestion.types.map(type => type.type.name).join(', ');

    if (selectedAnswer === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! The correct answer is ${correctAnswer}.`);
    }
  };

  if (!currentQuizQuestion) {
    return null;
  }

  const correctAnswer = currentQuizQuestion.types.map(type => type.type.name).join(', ');
  const wrongAnswers = ['fire', 'water', 'grass', 'electric', 'psychic', 'rock', 'ground', 'bug', 'ghost', 'dark', 'steel', 'dragon', 'fairy']
    .filter(type => !correctAnswer.includes(type))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

  return (
    <section id="pokemon-quiz" className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Pokemon Quiz</h2>
      <div className="p-4 bg-white rounded shadow">
        <button
          id="start-quiz"
          className="px-4 py-2 bg-green-500 text-white rounded mb-4"
          onClick={loadQuizQuestion}
        >
          Start Quiz
        </button>
        <div id="quiz-content" className="mt-4">
          <p id="quiz-question" className="text-lg font-semibold">
            What type is {currentQuizQuestion.name}?
          </p>
          <div id="quiz-options" className="mt-2">
            {options.map((option, index) => (
              <button
                key={index}
                className={`mt-2 px-4 py-2 rounded w-full ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300`}
                onClick={() => handleAnswerSelection(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            id="submit-answer"
            className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${selectedAnswer ? '' : 'hidden'}`}
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </button>
          {feedback && <p className="mt-4 text-lg font-semibold">{feedback}</p>}
        </div>
      </div>
    </section>
  );
};

export default Quiz;
