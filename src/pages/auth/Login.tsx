"use client"

// import React from 'react'
// import { Link } from 'react-router-dom'
// import { z } from "zod"
import { ProfileForm } from '../../components/auth/ProfileForm'

export const Login = () => {
  return (
    <main className='w-full h-screen flex flex-col items-center justify-center bg-white text-black'>
    <div className='w-2/5 h-fit p-8 shadow-slate-200 shadow-xl rounded-lg flex flex-col items-center justify-center'>
       <ProfileForm />
    </div>
    </main>
  )
}
