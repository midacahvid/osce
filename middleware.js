export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/quiz', '/checklist', '/dashboard'],
}
