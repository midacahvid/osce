'use client'
export default function QuestionCard({ questions, handleChange }) {
  let questionCount = 0
  return (
    <>
      {questions.map((ques) => {
        questionCount++
        return (
          <>
            <div className="question-card mb-6 p-4" key={ques.id} id={ques.id}>
              <h2 className="text-lg font-medium mb-2">
                Question {questionCount}/{questions.length}
              </h2>
              <p className="text-gray-700 mb-4">{ques.question}</p>
              <div className="space-y-2 option2">
                <input
                  type="radio"
                  id={ques.optionOne + ques.id}
                  name={ques.quesNo}
                  value={ques.optionOne}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  className="flex items-center px-4 py-2 bg-gray-200 rounded-md cursor-pointer transition duration-300"
                  htmlFor={ques.optionOne + ques.id}
                >
                  {ques.optionOne}
                </label>
                <input
                  type="radio"
                  id={ques.optionTwo + ques.id}
                  name={ques.quesNo}
                  value={ques.optionTwo}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  className="flex items-center px-4 py-2 bg-gray-200 rounded-md cursor-pointer transition duration-300"
                  htmlFor={ques.optionTwo + ques.id}
                >
                  {ques.optionTwo}
                </label>
                <input
                  type="radio"
                  id={ques.optionThree + ques.id}
                  name={ques.quesNo}
                  value={ques.optionThree}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  className="flex items-center px-4 py-2 bg-gray-200 rounded-md cursor-pointer transition duration-300"
                  htmlFor={ques.optionThree + ques.id}
                >
                  {ques.optionThree}
                </label>
                <input
                  id={ques.optionFour + ques.id}
                  type="radio"
                  name={ques.quesNo}
                  value={ques.optionFour}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  className="flex items-center px-4 py-2 bg-gray-200 rounded-md cursor-pointer transition duration-300"
                  htmlFor={ques.optionFour + ques.id}
                >
                  {ques.optionFour}
                </label>
              </div>
            </div>
          </>
        )
      })}
    </>
  )
}
