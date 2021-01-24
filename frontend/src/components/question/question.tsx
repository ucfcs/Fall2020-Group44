const Question = (props: QuestionProps) => {
  return (
    <div className="question">
      <p>{props.questionText}</p>

      {
        props.answers.map((answer: string, index: number) => {
          return (
            <div className="answer">
              <p>{index} {answer}</p>
            </div>
          )
        })
      }
    </div>
  );
};

interface QuestionProps {
  questionText: string,
  answers: string[]
};

export default Question;
