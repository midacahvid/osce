'use client'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'

export default function Result() {
  const [results, setResults] = useState([])
  //   const [exams, setExams] = useState('')
  //   const [examsTypes, setExamsTypes] = useState([])
  useEffect(() => {
    try {
      //   fetchExams()
      fetchResults()
    } catch (error) {
      console.log(error)
    }
  }, [])

  //   const fetchExams = async () => {
  //     await getDocs(collection(db, 'exams')).then((querySnapshot) => {
  //       const newData = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }))
  //       setExamsTypes(newData)
  //       // console.log(students, newData)
  //     })
  //   }

  const fetchResults = async () => {
    await getDocs(collection(db, 'students')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setResults(newData)
      //   console.log(students, newData)
    })
  }

  return (
    <>
      <section className=" w-full mt-5">
        <div className="row-span-3 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between px-6 py-3 font-semibold border-b border-gray-100">
            <span>Student Registration No</span>
            <button
              type="button"
              className="inline-flex justify-center rounded-md px-1 -mr-1 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-600"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
            >
              Score
              <svg
                className="-mr-1 ml-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-96">
            {results?.map((result) => {
              return (
                <li className="flex justify-between px-16" key={result.id}>
                  <span className="text-gray-600 mr-4 ml-3">
                    {result.regNo}
                  </span>
                  <strong className="text-gray-600  mr-4">
                    {result.objScore + result.osceScore}
                  </strong>
                </li>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
