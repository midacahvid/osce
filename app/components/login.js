'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { act, useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [stu, SetStu] = useState(true)
  const [exa, SetExa] = useState(false)
  const [examCode, setExamCode] = useState('')
  const [regNo, setRegNo] = useState()
  const { data: session } = useSession()
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

    const res = await signIn('credentials', {
      regNo: regNo,
      redirect: false,
    })
    if (res.error) {
      alert('students not reg')
    } else {
      router.push('/quiz')
      router.refresh()
    }
  }
  const loginExaminer = async (e) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      regNo: regNo,
      examCode: examCode,
      redirect: false,
    })
    if (res.error) {
      alert('you are not an examiner')
    } else {
      router.push('/checklist')
      router.refresh()
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
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
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
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
