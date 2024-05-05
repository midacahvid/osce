export default function Questionslist({ que, data, id }) {
  // const { id } = que
  const link = '#' + id
  const answerQues =
    'text-gray-700 text-white transition duration-300 bg-green-400 p-2 mr-2'
  const unAnswerQues =
    'text-gray-700 transition duration-300 bg-gray-300 p-2 mr-2'
  console.log(link)
  return (
    <li className="mb-6">
      <a href={link} class={data == '' ? unAnswerQues : answerQues}>
        {que}
      </a>
    </li>
  )
}
