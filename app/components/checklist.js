'use client'
import { useState, useEffect } from 'react'
import Activities from './activities'
import items from './items'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { useSession } from 'next-auth/react'

export default function List({
  setTotalScore,
  setTimeLeft,
  timeLeft,
  activities,
}) {
  const [formData, setFormData] = useState({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
  })
  const { data: session } = useSession()

  // const [myformatTime, setMyFormatTime] = useState('')

  useEffect(() => {
    if (timeLeft <= 0) {
      // Time up logic
      submitOsceScores(window.event)
      console.log('heloo')
    } else {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => {
        clearInterval(timerInterval)
      }
    }
  }, [timeLeft])

  useEffect(() => {
    setTotalScore(formData.one + formData.two + formData.three + formData.four)
  }, [formData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: Number(value),
    }))
  }

  const submitOsceScores = async (event) => {
    event.preventDefault()
    if (confirm('Are you sure you want to submit') == true) {
      const total = formData.one + formData.two + formData.three + formData.four
      const examRef = doc(db, 'students', session?.user?.id)
      try {
        await updateDoc(examRef, {
          osceScore: total,
        })

        alert(total + ' was submittedsuccessfully')
      } catch (error) {
        console.log(error)
      }
      alert(total)
    } else {
      alert('do not submit')
    }

    // console.log(total)
  }
  return (
    <div className="relative  question-card p-3 mt-5">
      <form onSubmit={submitOsceScores}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                Activities
              </th>
              <th scope="col" className="px-4 py-3">
                0
              </th>
              <th scope="col" className="px-4 py-3">
                1/4
              </th>
              <th scope="col" className="px-4 py-3">
                1/2
              </th>
              <th scope="col" className="px-4 py-3">
                1
              </th>
            </tr>
          </thead>
          <tbody>
            {activities?.map((item) => {
              return (
                <Activities
                  data={item}
                  handleChange={handleChange}
                  key={item.id}
                />
              )
            })}
          </tbody>
        </table>
        <button
          type="submit"
          id="nextBtn"
          className=" mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-green-400 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
