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
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

const SECS_PER_QUESTION = 30;

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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
  } = state;
  const totalPoints = questions?.reduce((acc, curr) => acc + curr.points, 0);

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
            <Progress
              answer={answer}
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />
              <NextButton
                numQuestions={numQuestions}
                index={index}
                dispatch={dispatch}
                answer={answer}
              />
            </Footer>
          </Fragment>
        )}

        {status === 'finished' && (
          <FinishScreen
            dispatch={dispatch}
            highScore={highScore}
            points={points}
            totalPoints={totalPoints}
          />
        )}
      </Main>
    </div>
  );
}

export default App;

