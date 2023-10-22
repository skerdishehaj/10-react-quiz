import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();
const SECS_PER_QUESTION = 30;
const BASE_URL = 'http://localhost:8000';
const initialState = {
  questions: [],

  // 'loading', 'ready', 'active', 'error', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case 'finish':
      console.dir(state);
      return {
        ...state,
        status: 'finished',
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case 'restart':
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions,
        highScore: state.highScore,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      return state;
  }
};

const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/questions`);
        const data = await res.json();
        if (data.length === 0) {
          throw new Error('No questions found');
        }
        dispatch({
          type: 'dataReceived',
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: 'dataFailed',
        });
      }
    };
    getQuestions();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        dispatch,
        numQuestions,
        totalPoints,
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export { QuizProvider, useQuiz };
