function NextButton({ index, dispatch, answer, numQuestions }) {
  if (answer === null) {
    return null;
  }

  return (
    <button
      className='btn btn-ui'
      onClick={() => {
        if (index === numQuestions - 1) {
          dispatch({ type: 'finish' });
          return;
        }
        dispatch({ type: 'nextQuestion' });
      }}
    >
      {index === numQuestions - 1 ? 'Finish' : 'Next'}
    </button>
  );
}

export default NextButton;
