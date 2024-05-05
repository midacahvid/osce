'use client'
import { useEffect, useState } from 'react'
import { getDocs, collection, addDoc, query, where } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default function AddExams() {
  const [exams, setExams] = useState('')
  const [examsObj, setExamsObj] = useState('')
  const [examsTypes, setExamsTypes] = useState([])
  const [quesNumber, setQuesNumber] = useState('')
  const [activity, setActivity] = useState('')
  const [optionOne, setOptionOne] = useState('')
  const [optionTwo, setOptionTwo] = useState('')
  const [optionThree, setOptionThree] = useState('')
  const [optionFour, setOptionFour] = useState('')
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [quesNo, setQuesNo] = useState('')
  useEffect(() => {
    try {
      fetchExams()
    } catch (error) {}
  }, [])

  //fetch exams type
  const fetchExams = async () => {
    await getDocs(collection(db, 'exams')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setExamsTypes(newData)
      // console.log(students, newData)
    })
  }

  //add activity
  const addActivity = async (e) => {
    e.preventDefault()

    // const q = query(
    //   collection(db, 'activities'),
    //   where('actNo', '==', quesNumber)
    // )
    const s = query(
      collection(db, 'activities'),
      where('exams', '==', exams),
      where('actNo', '==', quesNumber)
    )

    // const querySnapshot1 = await getDocs(q)
    const querySnapshot2 = await getDocs(s)

    if (!querySnapshot2.empty) {
      alert(
        'question No already exist for that course code, pls select another one'
      )
    } else {
      if (exams == '' || activity == '' || quesNumber == '') {
        alert('some fields are empty')
      } else {
        try {
          await addDoc(collection(db, 'activities'), {
            exams: exams,
            activity: activity,
            actNo: quesNumber,
          })
          fetchExams()
          alert('successful')
        } catch (error) {
          console.log('failed')
        }
      }
    }
  }

  const addQuestion = async (e) => {
    e.preventDefault()

    const s = query(
      collection(db, 'objectives'),
      where('exams', '==', examsObj),
      where('quesNo', '==', quesNo)
    )

    // const querySnapshot1 = await getDocs(q)
    const querySnapshot2 = await getDocs(s)

    if (!querySnapshot2.empty) {
      alert(
        'question No already exist for that course code, pls select another one'
      )
    } else {
      if (
        examsObj == '' ||
        question == '' ||
        quesNo == '' ||
        optionOne == '' ||
        optionTwo == '' ||
        optionThree == '' ||
        optionFour == '' ||
        correctAnswer == ''
      ) {
        alert('some fields are empty')
      } else {
        try {
          await addDoc(collection(db, 'objectives'), {
            exams: examsObj,
            quesNo: quesNo,
            question: question,
            optionOne: optionOne,
            optionTwo: optionTwo,
            optionThree: optionThree,
            optionFour: optionFour,
            correctAnswer: correctAnswer,
          })
          fetchExams()
          alert('successful')
        } catch (error) {
          console.log('failed')
        }
      }
    }
  }
  return (
    <div className=" flex flex-row justify-between flex-wrap  w-full">
      <form
        className=" question-card p-3 bg-white basis-full  mb-4 lg:basis-1/2"
        onSubmit={addQuestion}
      >
        <label
          for="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select exam Type
        </label>
        <select
          id="countries"
          value={examsObj}
          onChange={(e) => setExamsObj(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select exam type</option>
          {examsTypes?.map((examType) => {
            return (
              <option value={examType.code} key={examType.id}>
                {examType.code}
              </option>
            )
          })}
        </select>
        <div className="mb-5">
          <label
            for="message"
            className=" mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Question
          </label>
          <textarea
            id="message"
            rows="4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type question here..."
          ></textarea>
        </div>

        <div>
          <label
            for="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Option one
          </label>
          <input
            type="text"
            id="small-input"
            value={optionOne}
            onChange={(e) => setOptionOne(e.target.value)}
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Option two
          </label>
          <input
            type="text"
            id="small-input"
            value={optionTwo}
            onChange={(e) => setOptionTwo(e.target.value)}
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Option three
          </label>
          <input
            type="text"
            id="small-input"
            value={optionThree}
            onChange={(e) => setOptionThree(e.target.value)}
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Option four
          </label>
          <input
            type="text"
            id="small-input"
            value={optionFour}
            onChange={(e) => setOptionFour(e.target.value)}
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            for="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Correction answer
          </label>
          <input
            type="text"
            id="small-input"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <label
          for="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select question number
        </label>
        <select
          id="countries"
          value={quesNo}
          onChange={(e) => setQuesNo(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">select question No</option>
          <option value="one">one</option>
          <option value="two">two</option>
          <option value="three">three</option>
          <option value="four">four</option>
          <option value="five">five</option>
          <option value="six">six</option>
          <option value="seven">seven</option>
          <option value="eight">eight</option>
          <option value="nine">nine</option>
          <option value="ten">ten</option>
          <option>eleven</option>
          <option>twelve</option>
          <option>thirteen</option>
          <option>fourteen</option>
          <option>fifteen</option>
          <option>sixtenn</option>
          <option>seventeen</option>
          <option>eighteen</option>
          <option>nineteen</option>
          <option>tweente</option>
        </select>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
        >
          Add questions
        </button>
      </form>
      <form
        className="question-card p-3 bg-white basis-full lg:basis-1/2 h-fit"
        onSubmit={addActivity}
      >
        <label
          for="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select exam Type
        </label>
        <select
          id="countries"
          value={exams}
          onChange={(e) => setExams(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select exam type</option>
          {examsTypes?.map((examType) => {
            return (
              <option value={examType.code} key={examType.id}>
                {examType.code}
              </option>
            )
          })}
        </select>
        <label
          for="message"
          className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Activity
        </label>
        <textarea
          id="message"
          rows="4"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Type activity here..."
        ></textarea>
        <label
          for="countries"
          className=" mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select question number
        </label>
        <select
          id="countries"
          value={quesNumber}
          onChange={(e) => setQuesNumber(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">select question No</option>
          <option value="one">one</option>
          <option value="two">two</option>
          <option value="three">three</option>
          <option value="four">four</option>
          <option value="five">five</option>
          <option value="six">six</option>
          <option value="seven">seven</option>
          <option value="eight">eight</option>
          <option value="nine">nine</option>
          <option value="ten">ten</option>
          <option>eleven</option>
          <option>twelve</option>
          <option>thirteen</option>
          <option>fourteen</option>
          <option>fifteen</option>
          <option>sixtenn</option>
          <option>seventeen</option>
          <option>eighteen</option>
          <option>nineteen</option>
          <option>tweente</option>
        </select>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
        >
          Add Activities
        </button>
      </form>
    </div>
  )
}
