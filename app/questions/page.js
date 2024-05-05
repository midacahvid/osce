'use client'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'

export default function Questions() {
  const [exams, setExams] = useState('')
  const [examsTypes, setExamsTypes] = useState([])
  const [activities, setActivities] = useState([])
  const [objectives, setObjectives] = useState([])

  useEffect(() => {
    try {
      fetchExams()
    } catch (error) {
      console.log(error)
    }
  }, [])
  const deleteQuestion = async (id, lection) => {
    try {
      await deleteDoc(doc(db, lection, id))
      fetchQues()
      alert('student deleted succesfully')
      console.log(id, lection)
    } catch (error) {
      console.log(error)
    }
  }

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

  const fetchQuestions = async (e) => {
    e.preventDefault()
    const s = query(collection(db, 'objectives'), where('exams', '==', exams))
    const q = query(collection(db, 'activities'), where('exams', '==', exams))

    await getDocs(q).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setActivities(newData)
      console.log(newData)
    })
    await getDocs(s).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setObjectives(newData)
      console.log(newData)
    })
  }
  const fetchQues = async () => {
    const s = query(collection(db, 'objectives'), where('exams', '==', exams))
    const q = query(collection(db, 'activities'), where('exams', '==', exams))

    await getDocs(q).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setActivities(newData)
      console.log(newData)
    })
    await getDocs(s).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setObjectives(newData)
      console.log(newData)
    })
  }
  return (
    <>
      <div className=" flex justify-start w-full">
        <h1 className=" items-start font-bold">Questions</h1>
      </div>
      <div className=" flex flex-row justify-between w-full">
        <form
          class="question-card p-3 bg-white basis-full md:basis-1/2 lg:basis-1/2"
          onSubmit={fetchQuestions}
        >
          <label
            for="countries"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select course code
          </label>
          <select
            id="countries"
            value={exams}
            onChange={(e) => setExams(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select course code</option>
            {examsTypes?.map((examType) => {
              return (
                <option value={examType.code} key={examType.id}>
                  {examType.code}
                </option>
              )
            })}
          </select>

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
          >
            Get Questions
          </button>
        </form>
      </div>
      <section className=" w-full mb-4 mt-4">
        <div className="row-span-3 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between px-6 py-3 font-semibold border-b border-gray-100">
            <span>{exams} Procedure questions</span>
            <button
              type="button"
              className="inline-flex justify-center rounded-md px-1 -mr-1 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-600"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
            >
              Descending
              <svg
                className="-mr-1 ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-96 ">
            <div class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
              {activities?.map((act) => {
                return (
                  <div className="flex justify-between border-b-2" key={act.id}>
                    <p
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 dark:text-white w-7/12"
                    >
                      {act.activity}
                    </p>
                    <button
                      className=" ml-auto inline-flex px-1 py-1 text-blue-700 hover:text-blue-600 focus:text-blue-7500 hover:bg-purple-100 focus:bg-purple-100 border border-blue-700 rounded-md mb-3 mr-4 mt-2"
                      onClick={() => deleteQuestion(act.id, 'activities')}
                    >
                      <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* objections questions */}
      <section className=" w-full">
        <div className="row-span-3 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between px-6 py-3 font-semibold border-b border-gray-100">
            <span>{exams} Objective questions</span>
            <button
              type="button"
              className="inline-flex justify-center rounded-md px-1 -mr-1 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-600"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
            >
              Descending
              <svg
                className="-mr-1 ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="p-3 space-y-6">
              <li className="">
                {objectives?.map((ques) => {
                  // questionCount++
                  return (
                    <>
                      <div
                        className="question-card mb-6 p-4 w-full flex justify-between"
                        key={ques.id}
                        id={ques.id}
                      >
                        <div className="space-y-2 option2">
                          <p className="text-gray-700 mb-4">{ques.question}</p>

                          <p>{ques.optionOne}</p>
                          <p>{ques.optionTwo}</p>
                          <p>{ques.optionThree}</p>
                          <p>{ques.optionFour}</p>
                        </div>

                        <button
                          className=" ml-auto inline-flex px-1 py-1 text-blue-700 hover:text-blue-600 focus:text-blue-7500 hover:bg-purple-100 focus:bg-purple-100 border border-blue-700 rounded-md mb-3 h-fit"
                          onClick={() => deleteQuestion(ques.id, 'objectives')}
                        >
                          <svg
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </>
                  )
                })}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
