'use client'
import { useEffect, useState } from 'react'
import Aside from '../components/aside'
import StudentsCard from '../components/studentsCard'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    try {
      fetchStudents()
      // console.log(session)
    } catch (error) {
      console.log(error)
    }
  }, [])

  /// fetching students
  const fetchStudents = async () => {
    await getDocs(collection(db, 'students')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setStudents(newData)
      // console.log(students, newData)
    })
  }
  return (
    <>
      {session?.user?.userName ? (
        <div className="flex bg-gray-100 min-h-screen p-0">
          <Aside />
          <div className="flex-grow text-gray-800">
            <header className="flex items-center h-20 px-6 sm:px-10 bg-gray-100">
              <button className="block sm:hidden relative flex-shrink-0 p-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 rounded-full">
                <span className="sr-only">Menu</span>
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>
            </header>
            <main className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
                <div className="mr-6">
                  <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
                </div>
                <div className="flex flex-wrap items-start justify-end -mb-3">
                  <a href="/students">
                    <button className="inline-flex px-5 py-3 text-blue-700 hover:text-blue-600 focus:text-blue-7500 hover:bg-purple-100 focus:bg-purple-100 border border-blue-700 rounded-md mb-3">
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
                      Add students
                    </button>
                  </a>
                  <a href="/addexams">
                    <button className="inline-flex px-5 py-3 text-white bg-blue-700 hover:bg-blue-400 focus:bg-blue-500 rounded-md ml-6 mb-3">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add questions
                    </button>
                  </a>
                </div>
              </div>
              <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">62</span>
                    <span className="block text-gray-500">Students</span>
                  </div>
                </div>
                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">
                      Med surge practicals
                    </span>
                    <span className="block text-gray-500">Exam Title</span>
                  </div>
                </div>

                <div className="flex items-center p-8 bg-white shadow rounded-lg">
                  <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold">Active</span>
                    <span className="block text-gray-500">Status</span>
                  </div>
                </div>
              </section>
              <section className="">
                <div className="row-span-3 bg-white shadow rounded-lg">
                  <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
                    <span>List of students</span>
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
                    {/* <!-- Refer here for full dropdown menu code: https://tailwindui.com/components/application-ui/elements/dropdowns --> */}
                  </div>
                  <div className="overflow-y-auto max-h-96">
                    <ul className="p-6 space-y-6">
                      {students?.map((student) => {
                        return (
                          <StudentsCard
                            student={student}
                            fetchStudents={fetchStudents}
                            key={student.id}
                          />
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      ) : (
        'Sorry you are not allow to see this page'
      )}
    </>
  )
}
