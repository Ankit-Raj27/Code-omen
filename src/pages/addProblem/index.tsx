'use client'
import { firestore } from '@/Firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'

export default function AddProblem() {
  const [input, setInput] = useState({
    id: '',
    title: '',
    difficulty: '',
    videoId: '',
    link: '',
    order: 0,
    likes: 0,
    dislikes: 0,
    category: '',
    selectedList: 'striver150', 
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newProblem = {
      ...input,
      order: Number(input.order),
      likes: Number(input.likes),
      dislikes: Number(input.dislikes),
    }

    await setDoc(doc(firestore, input.selectedList, input.id), newProblem)
    alert(`Problem added to ${input.selectedList} collection!`)
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4 max-w-sm'>
        <input onChange={handleInputChange} type='text' placeholder='Problem ID' name='id' />
        <input onChange={handleInputChange} type='text' placeholder='Title' name='title' />
        <input onChange={handleInputChange} type='text' placeholder='Difficulty' name='difficulty' />
        <input onChange={handleInputChange} type='text' placeholder='Category' name='category' />
        <input onChange={handleInputChange} type='text' placeholder='Order' name='order' />
        <input onChange={handleInputChange} type='text' placeholder='Video ID (optional)' name='videoId' />
        <input onChange={handleInputChange} type='text' placeholder='Link (optional)' name='link' />

        <select name='selectedList' onChange={handleInputChange} value={input.selectedList}>
          <option value='striver150'>Striver 150</option>
          <option value='neetcode150'>Neetcode 150</option>
          <option value='gfg150'>GFG 150</option>
        </select>

        <button type='submit' className='bg-white'>Save to DB</button>
      </form>
    </main>
  )
}
