'use client'
import { useState, useEffect } from 'react'
import Activities from './activities'
import items from './items'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function List({
  setTotalScore,
  setTimeLeft,
  timeLeft,
  activities,
  params,
}) {
  const [formData, setFormData] = useState({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
  })
  const [spin, setSpin] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // const [myformatTime, setMyFormatTime] = useState('')

  useEffect(() => {
    if (timeLeft <= 0) {
      // Time up logic
      submitOsceScoresTime()
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
      setSpin(true)
      const total = formData.one + formData.two + formData.three + formData.four
      const examRef = doc(db, 'results', session?.user?.id)
      const myKey = `station${params.station}`
      try {
        await updateDoc(examRef, {
          [myKey]: total,
        })

        toast.success('Your scores have been submitted successfully')
        setSpin(false)
        router.push('/')
        router.refresh()
        signOut()
      } catch (error) {
        setSpin(false)
        toast.error('Something went wrong, Try again')
      }
    } else {
      toast.info('Alright continue')
    }
  }
  const submitOsceScoresTime = async () => {
    setSpin(true)
    const total = formData.one + formData.two + formData.three + formData.four
    const examRef = doc(db, 'results', session?.user?.id)
    const myKey = `station${params.station}`
    try {
      await updateDoc(examRef, {
        [myKey]: total,
      })
      setSpin(false)
      toast.success('Your scores have been submitted successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      setSpin(false)
      toast.error('Something went wrong, Try again')
    }
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
          class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex justify-center"
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
          {spin ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
