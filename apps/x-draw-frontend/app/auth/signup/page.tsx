import React from 'react'
import { AuthContainer } from '../../components/Auth/AuthComponent'

function SignUp() {
  return (
    <div>
      <AuthContainer isSignup={true} />
    </div>
  )
}

export default SignUp
