import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import './AptitudeTest.css';

const questions = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  // Add more questions for Verbal, Quantitative, and GK sections
];

function AptitudeTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerOptionClick = (option) => {
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      // Save score to Firestore
      const user = auth.currentUser;
      if (user) {
        updateDoc(doc(db, 'users', user.uid), {
          aptitudeScores: {
            total: score + (option === questions[currentQuestion].answer ? 1 : 0),
            // You can break down the score by section here
          }
        });
      }
    }
  };

  return (
    <div className='aptitude-test-container'>
      {showScore ? (
        <div className='score-section'>
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>{questions[currentQuestion].question}</div>
          </div>
          <div className='answer-section'>
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AptitudeTest;