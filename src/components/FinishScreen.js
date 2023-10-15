import { Fragment } from 'react';

function FinishScreen({ points, totalPoints, highScore }) {
  const percentage = (points / totalPoints) * 100;
  let emoji;
  if (percentage === 100) {
    emoji = '🥇';
  } else if (percentage > 80) {
    emoji = '😄';
  } else if (percentage > 60) {
    emoji = '😊';
  } else if (percentage > 40) {
    emoji = '😐';
  } else {
    emoji = '😞';
  }
  return (
    <Fragment>
      <p className='result'>
        {emoji} You scored <strong>{points}</strong> out of {totalPoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className='highscore'>(highscore: {highScore} points)</p>
    </Fragment>
  );
}
export default FinishScreen;
