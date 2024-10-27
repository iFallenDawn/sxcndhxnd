'use client'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { createCommission } from '@/app/actions'
const initialState = {
  message: null
}

const CommissionsForm = (props) => {
  const [state, formAction] = useFormState(createCommission, initialState)

  return (
    <form action={formAction} className='flex flex-col'>
      <label>
        First Name:
        <input type="text" name="firstName" />
      </label>
      <label>
        Last Name:
        <input type="text" name="lastName" />
      </label>
      <label>
        Email:
        <input type="text" name="email" />
      </label>
      <label>
        What type of commission do you want?
        <select className="border-solid border-2 border-sky-500" name='commissionType' >
          <option value="">Select one...</option>
          <option value="pants">Pants - $200</option>
          <option value="outerwear">Outerwear - $150</option>
          <option value="tops">Tops - $125</option>
          <option value="accessories">Accessories - $75</option>
          <option value="patchwork">Patchwork - $25-$50 PER reinforcement</option>
          <option value="hemming">Hemming - $20</option>
        </select>
      </label>
      <label className="flex">
        Describe the vision you have for the piece in as much detail as possible.
        <textarea name="pieceVision" placeholder="Type your message" className="border-solid border-2 border-sky-500" />
      </label>
      <label>
        Do you like symmetry, asymmetry, or a mix?
        <select name='symmetryType' >
          <option value="">Select one...</option>
          <option value='symmetry'>Symmetry</option>
          <option value='asymmetry'>Asymmetry</option>
          <option value='mix'>A mix of both</option>
        </select>
      </label>
      <label>
        Are you providing the base article of clothing, or do you want me to source it?
      </label>
      <label>
        You receive a 10% discount for providing the base clothes.
        <select name='baseMaterial'>
          <option value="">Select one...</option>
          <option value='Yes'>Yes, I'm providing the base.</option>
          <option value='No'>No, I want you to source all of the materials.</option>
        </select>
      </label>
      <label>
        What colors do you want?
        <input type="text" name="colors" />
      </label>
      <label>
        What type of fabrics do you want?
        <input type="text" name="fabrics" />
      </label>
      <label className="flex">
        Please provide some loose detail on shape patterns you prefer
        <textarea name='shapePatterns' placeholder="Type your message" className="border-solid border-2 border-sky-500" />
      </label>
      <label>
        Would you like to add some distress (wear and tear)?
        <select name="distress">
          <option value="">Select one...</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
      </label>
      <label>
        If it's an old piece, do you need it retailored?
        <select name="retailor" >
          <option value="">Select one...</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
      </label>
      <label>
        If you would like pockets, where would you want me to add them? Please specify if you don't want pockets
        <input type="text" name="pockets" />
      </label>
      <label>
        Do you want me to send you weekly check-ins?
        <select name="weeklyChecks" >
          <option value="">Select one...</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
      </label>
      <label className="flex">
        Anything else I should know?
        <textarea name='extra' placeholder="Type your message" className="border-solid border-2 border-sky-500" />
      </label>
      <button>Submit</button>
    </form>
  )
}

export default CommissionsForm