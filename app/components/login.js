'use client'

import { doc, getDoc } from 'firebase/firestore'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { act, useState } from 'react'
import { db } from '../firebaseConfig'
import { toast } from 'sonner'
import useNetworkStatus from '../network'

export default function Login() {
  const router = useRouter()
  const [stu, SetStu] = useState(true)
  const [exa, SetExa] = useState(false)
  const [examCode, setExamCode] = useState('')
  const [regNo, setRegNo] = useState()
  const [stationStu, setStationStu] = useState('')
  const [stationExa, setStationExa] = useState('')
  const [spin, setSpin] = useState(false)
  const { data: session } = useSession()
  const { isOnline } = useNetworkStatus()
  // if (session) {
  //   router.push('/quiz')
  // }
  let activeNo = ''
  let active = 'border-b-2 border-blue-700 font-bold'
  const studentLogin = () => {
    if (!stu) {
      SetStu(true)
      SetExa(false)
    }
  }
  const examinerLogin = () => {
    if (!exa) {
      SetExa(true)
      SetStu(false)
    }
  }

  const loginStudent = async (e) => {
    e.preventDefault()

    setSpin(true)
    if (regNo == '' || stationStu == '') {
      toast.error('Some fields are empty')
      setSpin(false)
      return
    }
    let myNo = regNo?.trim().split('/').join('')
    myNo = myNo?.toUpperCase()
    const docRef = doc(db, 'results', myNo)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists() && docSnap.data()[`station${stationStu}`] >= 1) {
      toast.error(
        'You have already taking this station, select another station'
      )
      setSpin(false)
    } else {
      const res = await signIn('credentials', {
        regNo: regNo.toUpperCase(),
        redirect: false,
      })
      if (res.error) {
        setSpin(false)
        toast.error('you are not a student')
      } else {
        setSpin(false)
        router.push(`/quiz/${stationStu}`)
        router.refresh()
      }
    }
  }
  const loginExaminer = async (e) => {
    e.preventDefault()
    setSpin(true)
    if (regNo == '' || examCode == '' || stationExa == '') {
      toast.error('Some fields are empty')
      setSpin(false)
      return
    }
    let myNo = regNo?.trim().split('/').join('')
    myNo = myNo?.toUpperCase()
    const docRef = doc(db, 'results', myNo)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists() && docSnap.data()[`station${stationExa}`] >= 0.25) {
      toast.error(
        'This student have already taking this station, select another station'
      )
      setSpin(false)
    } else {
      const res = await signIn('credentials', {
        regNo: regNo.toUpperCase(),
        examCode: examCode,
        redirect: false,
      })
      if (res.error) {
        toast.error('You are not an examiner')
        setSpin(false)
      } else {
        setSpin(false)
        router.push(`/checklist/${stationExa}`)
        router.refresh()
      }
    }
  }
  return (
    <section class="bg-gray-50 dark:bg-gray-900 w-full lg:w-1/2">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img class="w-10 h-10 mr-2" src="/buk-logo.png" alt="logo" />
          Nursing BUK
        </a>
        <div className=" flex flex-row justify-between gap-4 mb-4">
          <p onClick={studentLogin} className={stu ? active : ''}>
            Student Login
          </p>
          <p onClick={examinerLogin} className={exa ? active : ''}>
            Examiner Login
          </p>
        </div>
        {stu ? (
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {stu ? 'Student Login' : ''}
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={loginStudent}
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter Reg No
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    id="password"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="Enter Registrion No"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <label
                  for="countries"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Station No
                </label>
                <select
                  id="countries"
                  value={stationStu}
                  onChange={(e) => setStationStu(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">select station No</option>
                  <option value="1">one</option>
                  <option value="2">two</option>
                  <option value="3">three</option>
                  <option value="4">four</option>
                  <option value="5">five</option>
                  <option value="6">six</option>
                </select>
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
                  {spin ? 'Login...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {stu ? '' : 'Examiner Login'}
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={loginExaminer}
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter Reg No
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    id="password"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="Enter Registrion No"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter Exam code
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="Enter Exam code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <label
                  for="countries"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Station No
                </label>
                <select
                  id="countries"
                  value={stationExa}
                  onChange={(e) => setStationExa(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">select station No</option>
                  <option value="1">one</option>
                  <option value="2">two</option>
                  <option value="3">three</option>
                  <option value="4">four</option>
                  <option value="5">five</option>
                  <option value="6">six</option>
                </select>
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
                  {spin ? 'Login...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
