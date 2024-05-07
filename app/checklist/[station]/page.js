'use client'
import { useState, useEffect } from 'react'
import List from '../../components/checklist'
import { db } from '../../firebaseConfig'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'

export default function CheckList({ params }) {
  const [totalScore, setTotalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1 * 60)
  const [enabled, setEnabled] = useState([])
  const [activities, setActivities] = useState([])
  const [exams, setExams] = useState([])
  const { data: session } = useSession()
  const user = session?.user
  useEffect(() => {
    try {
      enableItem()
      fetchExams()
      getActivities()
    } catch (error) {
      console.log(error)
    }
  }, [enabled])

  //fetch activities exams

  const getActivities = async () => {
    if (enabled.length >= 1) {
      const q = query(
        collection(db, 'activities'),
        where('exams', '==', enabled[0].courseCode),
        where('exams', '==', params.station)
      )
      await getDocs(q).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setActivities(newData)
        // console.log(newData)
      })
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

  // fetch exam
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
  const enableItem = async () => {
    await getDocs(collection(db, 'currentExam')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setEnabled(newData)
    })
  }

  return (
    <>
      {user?.examCode ? (
        <div className=" bg-white p-6 w-full rounded-md">
          <div className=" flex flex-row flex-wrap justify-between question-card p-3">
            <div>
              <h1 className=" mb-2">
                Reg No: <strong>{user?.regNo}</strong>
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
            <div>
              <h1 className=" bg-blue-700 px-4 py-2 h-fit text-white rounded-md">
                <strong>Time Left: </strong>
                {formatTime(timeLeft)}
              </h1>
              <h1 className=" bg-blue-700 px-4 py-2 h-fit text-white rounded-md mt-4">
                <strong>Score: </strong>
                {totalScore}
              </h1>
            </div>
          </div>
          <List
            setTotalScore={setTotalScore}
            setTimeLeft={setTimeLeft}
            timeLeft={timeLeft}
            activities={activities}
            params={params}
          />
        </div>
      ) : (
        'sorry you can access this page'
      )}
    </>
  )
}
