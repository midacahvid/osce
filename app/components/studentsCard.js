import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default function StudentsCard({ student, fetchStudents }) {
  const { id, name, regNo } = student
  const deleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, 'students', id))
      fetchStudents()
      alert('student deleted succesfully')
      console.log()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <li className="flex items-center" key={id}>
      <span className="text-gray-600 mr-4 ml-3">{regNo}</span>
      <strong className="text-gray-600">{name}</strong>
      {/* <button className=" ml-auto inline-flex px-1 py-1 text-blue-700 hover:text-blue-600 focus:text-blue-7500 hover:bg-purple-100 focus:bg-purple-100 border border-blue-700 rounded-md mb-3">
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
        Edit
      </button> */}
      <button
        className=" mt-2 mr-4 ml-auto inline-flex px-2 py-1 text-blue-700 hover:text-blue-600 focus:text-blue-7500 hover:bg-purple-100 focus:bg-purple-100 border border-blue-700 rounded-md mb-3"
        onClick={() => deleteStudent(id)}
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
    </li>
  )
}
