'use client'
import Questionslist from '../../components/questionslist'
import { useState, useEffect } from 'react'
import QuestionCard from '../../components/questionCard'
import { db } from '../../firebaseConfig'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
export default function ({ params }) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
  })
  const [spin, setSpin] = useState(false)

  const [timeLeft, setTimeLeft] = useState(10 * 60) // 5 minutes in seconds
  const [enabled, setEnabled] = useState([])
  const [questions, setQuestions] = useState([])
  const [exams, setExams] = useState([])
  const router = useRouter()
  let questionCount = 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      submitScoresTime()
    } else if (timeLeft >= 1190) {
      enableItem()
      fetchExams()
      getQuestions()
      console.log(session)
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => {
        clearInterval(timerInterval)
      }
    } else {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => {
        clearInterval(timerInterval)
      }
    }
  }, [timeLeft])

  // useEffect(() => {
  //   try {
  //     enableItem()
  //     fetchExams()
  //     getQuestions()
  //     console.log('run')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [enabled])

  //fetch activities exams

  const getQuestions = async () => {
    if (enabled.length >= 1) {
      const q = query(
        collection(db, 'objectives'),
        where('exams', '==', enabled[0].courseCode),
        where('stationObj', '==', params.station)
      )
      await getDocs(q).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setQuestions(newData)
        // console.log(newData)
      })
    }
  }
  // fetch exams detales
  const fetchExams = async () => {
    if (enabled.length >= 1) {
      const q = query(
        collection(db, 'exams'),
        where('code', '==', enabled[0].courseCode)
      )
      await getDocs(q).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setExams(newData)
        // console.log(newData)
      })
    }
  }

  // fetch current exams
  const enableItem = async () => {
    await getDocs(collection(db, 'currentExam')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setEnabled(newData)
    })
  }

  const submitScores = async (e) => {
    e.preventDefault()

    if (confirm('Are you sure you want to submit') == true) {
      setSpin(true)
      let totalscores = 0
      let keys = Object.keys(formData)
      questions.forEach((ques) => {
        keys.map((key) => {
          let myKey = key
          if (ques.quesNo == key && ques.correctAnswer == formData[myKey]) {
            console.log(ques.correctAnswer + '' + formData[myKey])
            totalscores++
          } else {
            console.log('false')
          }
        })
      })
      const myKey = `station${params.station}`
      const examRef = doc(db, 'results', session?.user?.id)
      try {
        await updateDoc(examRef, {
          [myKey]: totalscores,
        })
        setSpin(false)
        toast.success('Scores have been submitted successfully')
        router.push('/')
        router.refresh()
        signOut()
      } catch (error) {
        toast.error('Something when wrong, Submit again')
      }
    } else {
      console.log('false')
    }
  }

  const submitScoresTime = async () => {
    setSpin(true)
    let totalscores = 0
    let keys = Object.keys(formData)
    questions.forEach((ques) => {
      keys.map((key) => {
        let myKey = key
        if (ques.quesNo == key && ques.correctAnswer == formData[myKey]) {
          console.log(ques.correctAnswer + '' + formData[myKey])
          totalscores++
        } else {
          console.log('false')
        }
      })
    })
    const myKey = `station${params.station}`
    const examRef = doc(db, 'results', session?.user?.id)
    try {
      await updateDoc(examRef, {
        [myKey]: totalscores,
      })
      setSpin(false)
      toast.success('Scores have been submitted successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      setSpin(false)
      toast.error('Something when wrong, Submit again')
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`
  }

  return (
    <>
      {session?.user?.examCode ? (
        'you are not allow to view this page'
      ) : (
        <div class="my-8 p-6  flex gap-4 flex-wrap w-full">
          <form
            onSubmit={submitScores}
            className=" p-6 bg-white rounded-lg shadow-md basis-full lg:basis-7/12"
          >
            <div>
              <div className=" flex flex-row flex-wrap justify-between question-card p-3 mb-3">
                <div>
                  <h1 className=" mb-2">
                    Reg No: <strong>{session?.user?.regNo}</strong>
                  </h1>
                  <h1 className=" mb-2">
                    Course Code:
                    {enabled?.map((ena) => {
                      return <strong key={1}> {ena.courseCode}</strong>
                    })}
                  </h1>
                  <h1 className=" mb-2">
                    course title:
                    {exams?.map((exam) => {
                      return <strong key={2}> {exam.title}</strong>
                    })}
                  </h1>
                  <h1 className=" mb-2">
                    Time allow:
                    {exams?.map((exam) => {
                      return <strong key={3}> {exam.time}</strong>
                    })}
                  </h1>
                </div>
                <div className="flex justify-between">
                  {/* <h1 class="text-2xl font-bold mb-4">Quiz</h1> */}
                  <div className=" inline-flex ">
                    <h1 className=" font-bold mr-3 mt-1">Time Left</h1>
                    <div
                      id="timer"
                      className="mb-4 text-right text-white rounded-md px-3 pt-1 font-bold bg-blue-700 h-fit"
                    >
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Question Card --> */}
              <QuestionCard questions={questions} handleChange={handleChange} />

              {/* <!-- Navigation buttons --> */}
              <div className="flex justify-between">
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
              </div>
            </div>
          </form>
          <div className="basis-full lg:basis-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
            <h1 className=" font-bold mb-4">Navigate Questions</h1>
            <ul className="question-list inline-flex flex-wrap">
              {questions.map((que) => {
                let myNo = que.quesNo
                questionCount++
                return (
                  <div key={que.id}>
                    <Questionslist
                      que={questionCount}
                      id={que.id}
                      data={formData[myNo]}
                    />
                  </div>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
