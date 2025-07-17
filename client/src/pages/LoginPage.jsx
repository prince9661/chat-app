import React, { useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../contex/AuthContex'
import axios from 'axios'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [currState, setCurrState] = useState('Sign Up')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const { login } = React.useContext(AuthContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    // Step 1: User submits basic data
    if (currState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    // Step 2: Send OTP to email
    if (currState === 'Sign Up' && !otpSent) {
      try {
        const res = await axios.post('/api/auth/signup', {
          fullName,
          email,
          password,
          bio
        })

        if (res.data.success) {
          toast.success('OTP sent to your email')
          setOtpSent(true)
        } else {
          toast.error(res.data.message)
        }
      } catch (err) {
        toast.error('Something went wrong')
      }
      return
    }

    // Step 3: Verify OTP
    if (currState === 'Sign Up' && otpSent) {
      try {
        const res = await axios.post('/api/auth/verify-otp', {
          email,
          otp,
          password
        })

        if (res.data.success) {
          toast.success('🎉 Account created! Welcome email sent.')
          login('login', { email, password }) // auto-login
        } else {
          toast.error(res.data.message)
        }
      } catch (err) {
        toast.error('OTP verification failed')
      }
      return
    }

    // Login flow
    login('login', { email, password })
  }

  return (
    <div className='min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />
      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'
      >
        <h2 className='font-medium text-2xl flex justify-center items-center'>
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => {
                setIsDataSubmitted(false)
                setOtpSent(false)
              }}
              src={assets.arrow_icon}
              alt=''
              className='w-5 cursor-pointer ml-2'
            />
          )}
        </h2>

        {/* Full Name input */}
        {currState === 'Sign Up' && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type='text'
            placeholder='Full Name'
            className='p-2 rounded-md border border-gray-500 focus:outline-none'
            required
          />
        )}

        {/* Email & Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Email'
              className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Password'
              className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </>
        )}

        {/* Bio */}
        {currState === 'Sign Up' && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder='Bio'
            className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            required
          />
        )}

        {/* OTP Input */}
        {currState === 'Sign Up' && otpSent && (
          <input
            type='text'
            placeholder='Enter OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            required
          />
        )}

        <button
          type='submit'
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currState === 'Sign Up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type='checkbox' />
          <p>Agree to the terms and conditions</p>
        </div>

        {/* Switch Auth Mode */}
        <div className='flex flex-col gap-2'>
          {currState === 'Sign Up' ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setCurrState('Login')
                  setIsDataSubmitted(false)
                  setOtpSent(false)
                }}
                className='text-violet-500 font-medium cursor-pointer'
              >
                Login
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <span
                onClick={() => {
                  setCurrState('Sign Up')
                }}
                className='text-violet-500 font-medium cursor-pointer'
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
