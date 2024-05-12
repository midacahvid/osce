import { db } from '@/app/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        regNo: {},
        examCode: {},
        password: {},
        userName: {},
      },
      async authorize(credentials, req) {
        if (credentials?.examCode) {
          const q = query(
            collection(db, 'students'),
            where('regNo', '==', credentials?.regNo)
          )
          const s = query(
            collection(db, 'currentExam'),
            where('examCode', '==', credentials?.examCode)
          )
          let user = {}
          const querySnapshot1 = await getDocs(q)
          const querySnapshot2 = await getDocs(s)
          if (querySnapshot1.empty) {
            return null
          }
          querySnapshot1.forEach((doc) => {
            user = { ...doc.data(), id: doc.id }
          })
          querySnapshot2.forEach((doc) => {
            user['examCode'] = doc.data().examCode
          })
          if (user.examCode == credentials?.examCode) {
            return user
          }
          // Return null if user data could not be retrieved
          return null
        } else if (credentials?.userName && credentials?.password) {
          const q = query(
            collection(db, 'admin'),
            where('username', '==', credentials?.userName)
          )

          let user = {}
          const querySnapshot = await getDocs(q)
          querySnapshot.forEach((doc) => {
            user = { ...doc.data(), id: doc.id }
          })

          if (user.password == credentials?.password) {
            return user
          }
          return null
        } else {
          const q = query(
            collection(db, 'students'),
            where('regNo', '==', credentials?.regNo)
          )
          let user = {}
          const querySnapshot = await getDocs(q)
          querySnapshot.forEach((doc) => {
            user = { ...doc.data(), id: doc.id }
          })
          if (!querySnapshot.empty) {
            return user
          }
          // Return null if user data could not be retrieved
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          regNo: user.regNo,
          name: user.name,
          examCode: user.examCode,
          userName: user.username,
        }
      }
      return token
    },
    async session({ token, user, session }) {
      if (session) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            name: token.name,
            examCode: token.examCode,
            regNo: token.regNo,
            userName: token.userName,
          },
        }
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
