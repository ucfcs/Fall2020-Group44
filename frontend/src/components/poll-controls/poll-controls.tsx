import "./poll-controls.scss";

const PollControls = (props: PollControlsProps) => {
  return (
    <div className="poll-controls">
      <button className="back-button">Back</button>

      <button className="next-button">Next</button>

      <button className="skip-button">Skip Poll</button>
    </div>
  );
};

interface PollControlsProps {
  questionNumber: number;
  questionCount: number;
};

export default PollControls;
