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
import { useSession } from 'next-auth/react'
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

  const [timeLeft, setTimeLeft] = useState(20 * 60) // 5 minutes in seconds
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

        toast.success('Scores have been submitted successfully')
        router.push('/')
        router.refresh()
      } catch (error) {
        toast.error('Something when wrong, Submit again')
      }
    } else {
      console.log('false')
    }
  }

  const submitScoresTime = async () => {
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

      toast.success('Scores have been submitted successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
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
                  id="nextBtn"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-green-400 transition duration-300"
                >
                  Submit
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
