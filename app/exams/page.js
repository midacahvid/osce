'use client'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
} from 'firebase/firestore'
export default function Exams() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [time, setTime] = useState(0)
  const [exams, setExams] = useState([])
  const [enabled, setEnabled] = useState([])

  useEffect(() => {
    try {
      enableItem()
      fetchExams()
    } catch (error) {
      console.log(error)
    }
  }, [])

  //ADD EXAMS
  const addExams = async (e) => {
    e.preventDefault()

    let myNo = code.toUpperCase()

    const docRef = doc(db, 'exams', myNo)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      alert('exams already exist')
    } else {
      try {
        await setDoc(doc(db, 'exams', myNo), {
          title: title,
          code: code.toUpperCase(),
          time: time,
        })
        fetchExams()
        alert('successful')
      } catch (error) {
        console.log('failed')
      }
    }
  }

  // fetchexams
  const fetchExams = async () => {
    await getDocs(collection(db, 'exams')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setExams(newData)
      // console.log(students, newData)
    })
  }
  const enableItem = async () => {
    await getDocs(collection(db, 'currentExam')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setEnabled(newData)
      console.log(newData)
    })
  }

  //enable exams

  const enableExams = async (code) => {
    const examRef = doc(db, 'currentExam', 'enableExam')
    try {
      await updateDoc(examRef, {
        courseCode: code,
      })
      enableItem()
      fetchExams()
      alert(code + ' was successfully enabled')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className=" flex flex-row gap-8 w-full">
        <form
          className=" question-card p-3 bg-white basis-full md:basis-1/2 lg:basis-1/2"
          onSubmit={addExams}
        >
          <div>
            <label
              for="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Course code
            </label>
            <input
              type="text"
              id="small-input"
              value={code}
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <label
              for="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Coures title
            </label>
            <input
              type="text"
              value={title}
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label
              for="small-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Time allow
            </label>
            <input
              type="number"
              id="small-input"
              value={time}
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
          >
            Add Exams
          </button>
        </form>
      </div>
      <section className=" w-full mt-5">
        <div className="row-span-3 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between px-6 py-3 font-semibold border-b border-gray-100">
            <span>Exams available</span>
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
              {exams?.map((exam) => {
                return (
                  <li className="flex items-center" key={exam.id}>
                    <strong className="text-gray-600 mr-2">{exam.code}</strong>
                    <span className="text-gray-600 mr-2">{exam.title}</span>
                    <span className="text-gray-600">{exam.time}</span>
                    <button
                      className=" ml-auto inline-flex px-1 py-1 text-blue-700 hover:text-blue-600 focus:text-blue-7500 hover:bg-purple-100 focus:bg-purple-100 border border-blue-700 rounded-md mb-3"
                      onClick={() => enableExams(exam.code)}
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
                      {enabled[0].courseCode == exam.code
                        ? 'Enabled'
                        : 'Disabled'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
