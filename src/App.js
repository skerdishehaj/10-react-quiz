import { useEffect } from 'react';
import Header from './components/Header';
import Main from './Main';
import { useReducer } from 'react';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import { Fragment } from 'react';
import NextButton from './components/NextButton';

const initialState = {
  questions: [],
  // 'loading', 'ready', 'active', 'error', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
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
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, answer } = state;

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: 'dataReceived',
          payload: data,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'dataFailed',
        });
      });
  }, []);

  const numQuestions = questions.length;

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
            dispatch={dispatch}
            numQuestions={numQuestions}
          />
        )}
        {status === 'active' && (
          <Fragment>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
            />
          </Fragment>
        )}
      </Main>
    </div>
  );
}

export default App;

