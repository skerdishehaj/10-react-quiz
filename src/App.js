import { useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import { useReducer } from 'react';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
  questions: [],
  // 'loading', 'ready', 'active', 'error', 'finished'
  status: 'loading',
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
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status } = state;

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
        {status === 'active' && <Question questions={questions} />}
      </Main>
    </div>
  );
}

export default App;

