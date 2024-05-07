'use client'
import { useEffect, useState } from 'react'
import StudentsCard from '../components/studentsCard'
import { db } from '../firebaseConfig'
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore'
import { toast } from 'sonner'
export default function Students() {
  const [regNo, setRegNo] = useState('')
  const [name, setName] = useState('')
  const [students, setStudents] = useState([])
  useEffect(() => {
    try {
      fetchStudents()
      console.log(students)
    } catch (error) {
      console.log(error)
    }
  }, [])

  //fetch students
  const fetchStudents = async () => {
    await getDocs(collection(db, 'students')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setStudents(newData)
    })
  }

  //delete students
  // const deleteStudent = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, 'students', id))
  //     fetchStudents()
  //     alert('student deleted succesfully')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const addStudent = async (e) => {
    e.preventDefault()
    let myNo = regNo.trim().split('/').join('')
    myNo = myNo.toUpperCase()

    const docRef = doc(db, 'students', myNo)
    const docSnap = await getDoc(docRef)

    if (name == '' || regNo == '') {
      toast.error('Some fields are empty')
    } else if (docSnap.exists()) {
      toast.error('Student already register')
    } else {
      try {
        await setDoc(doc(db, 'students', myNo), {
          name: name,
          regNo: regNo.toUpperCase(),
        })
        await setDoc(doc(db, 'results', myNo), {
          name: name,
          station1: 0,
          station2: 0,
          station3: 0,
          station4: 0,
          station5: 0,
          station6: 0,
          regNo: regNo.toUpperCase(),
        })
        fetchStudents()
        toast.success('Student registered successfully')
      } catch (error) {
        toast.error('An error occur try again')
      }
    }
  }

  return (
    <>
      <div className=" flex flex-row gap-8 w-full">
        <form
          class=" question-card p-3 bg-white basis-full md:basis-1/2 lg:basis-1/2"
          onSubmit={addStudent}
        >
          <div>
            <label
              for="small-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Students Reg No
            </label>
            <input
              type="text"
              id="small-input"
              value={regNo}
              class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setRegNo(e.target.value)}
            />
          </div>
          <div>
            <label
              for="small-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Students Name
            </label>
            <input
              type="text"
              id="small-input"
              value={name}
              class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
          >
            Add Add students
          </button>
        </form>
      </div>

      <section className=" w-full mt-5">
        <div className="row-span-3 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between px-6 py-3 font-semibold border-b border-gray-100">
            <span>Registered Students</span>
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
            {students?.map((student) => {
              return (
                <StudentsCard
                  student={student}
                  fetchStudents={fetchStudents}
                  key={student.id}
                />
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
