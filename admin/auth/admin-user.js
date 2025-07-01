// auth/admin-user.js
import bcrypt from 'bcryptjs'

const plainPassword = 'admin123'

export async function getAdmin() {
  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  return {
    email: 'admin@bpkd.go.id',
    password: hashedPassword,
  }
}
