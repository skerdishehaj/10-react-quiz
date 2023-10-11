import { useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import { useReducer } from 'react';

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
    case 'error':
      return {
        ...state,
        status: 'dataFailed',
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, {});

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

  return (
    <div className='app'>
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question</p>
      </Main>
    </div>
  );
}

export default App;

