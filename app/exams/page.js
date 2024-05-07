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
import { toast } from 'sonner'
export default function Exams() {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [time, setTime] = useState(0)
  const [exams, setExams] = useState([])
  const [enabled, setEnabled] = useState([])
  const [spin, setSpin] = useState(false)

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
    setSpin(true)

    let myNo = code.toUpperCase()

    if (title == '' || code == '' || time == 0) {
      toast.error('Some fields are empty')
      setSpin(false)
      return
    }

    const docRef = doc(db, 'exams', myNo)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      toast.error('This exams already exist')
      setSpin(false)
    } else {
      try {
        await setDoc(doc(db, 'exams', myNo), {
          title: title,
          code: code.toUpperCase(),
          time: time,
        })
        fetchExams()
        setSpin(false)
        toast.success('Exam addedd successfully')
      } catch (error) {
        setSpin(false)
        toast.error('Something went wrong')
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
      toast.success(code + ' was successfully enabled')
    } catch (error) {
      toast.error('Something went wrong')
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
          {/* <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
          >
            Add Exams
          </button> */}
          <button
            type="submit"
            class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex justify-center mt-4"
          >
            {spin ? (
              <svg
                aria-hidden="false"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              ''
            )}
            {spin ? 'Adding exams...' : 'Add Exams'}
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
