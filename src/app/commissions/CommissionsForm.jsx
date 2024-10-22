'use client'
import { useState } from 'react'
const CommissionsForm = (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [colors, setColors] = useState('')
  const [fabrics, setFabrics] = useState('')
  const [pockets, setPockets] = useState('')

  const [commissionType, setCommissionType] = useState('')
  const [symmetryType, setSymmetryType] = useState('')

  const handleFirstName = (e) => setFirstName(e.target.value)
  const handleLastName = (e) => setLastName(e.target.value)
  const handleEmail = (e) => setLastName(e.target.value)
  const handleCommissionType = (e) => setCommissionType(e.target.value)
  const handleSymmetryType = (e) => setSymmetryType(e.target.value)
  const handleColors = (e) => setColors(e.target.value)
  const handleFabrics = (e) => setFabrics(e.target.value)
  const handlePockets = (e) => setPockets(e.target.value)

  return (
    <form className='flex flex-col'>
      <label>
        First Name:
        <input type="text" name="firstName" onChange={handleFirstName} />
      </label>
      <label>
        Last Name:
        <input type="text" name="lastName" onChange={handleLastName} />
      </label>
      <label>
        Email:
        <input type="text" name="email" onChange={handleEmail} />
      </label>
      <label>
        What type of commission do you want?
        <select className="border-solid border-2 border-sky-500" name='commissionType' onChange={handleCommissionType}>
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
        <select name='symmetryType' onChange={handleSymmetryType}>
          <option value='symmetry'>Symmetry</option>
          <option value='asymmetry'>Asymmetry</option>
          <option value='mix'>A mix of both/option</option>
        </select>
        <label>
          Symmetry
          <input type="radio" name='symmetry' value="Symmetry" />
        </label>
        <label>
          Asymmetry
          <input type="radio" name='symmetry' value="Asymmetry" />
        </label>
        <label>
          A mix of both
          <input type="radio" name='symmetry' value="A mix of both" />
        </label>
      </label>
      <label>
        Are you providing the base article of clothing, or do you want me to source it?
      </label>
      <label>
        You receive a 10% discount for providing the base clothes.
        <label>
          Yes, I'm providing the base
          <input type="radio" name='baseMaterial' value="Yes, I'm providing the base" />
        </label>
        <label>
          No, I want you to source all the materials.
          <input type="radio" name='baseMaterial' value="No, I want you to source all the materials." />
        </label>
      </label>
      <label>
        What colors do you want?
        <input type="text" name="colors" onChange={handleColors} />
      </label>
      <label>
        What type of fabrics do you want?
        <input type="text" name="fabrics" onChange={handleFabrics} />
      </label>
      <label className="flex">
        Please provide some loose detail on shape patterns you prefer
        <textarea name='shapePatterns' placeholder="Type your message" className="border-solid border-2 border-sky-500" />
      </label>
      <label>
        Would you like to add some distress (wear and tear)?
        <label>
          Yes
          <input type="radio" name='distress' value="Yes" />
        </label>
        <label>
          No
          <input type="radio" name='distress' value="No" />
        </label>
      </label>
      <label>
        If it's an old piece, do you need it retailored?
        <label>
          Yes
          <input type="radio" name='retailor' value="Yes" />
        </label>
        <label>
          No
          <input type="radio" name='retailor' value="No" />
        </label>
      </label>
      <label>
        Do you want me to add pockets anywhere?
        <input type="text" name="pockets" onChange={handlePockets} />
      </label>
      <label>
        Do you want me to send you weekly check-ins?
        <label>
          Yes
          <input type="radio" name='weeklyChecks' value="Yes" />
        </label>
        <label>
          No
          <input type="radio" name='weeklyChecks' value="No" />
        </label>
      </label>
      <label className="flex">
        Anything else I should know?
        <textarea name='extra ' placeholder="Type your message" className="border-solid border-2 border-sky-500" />
      </label>
      <button>Submit</button>
    </form>
  )
}

export default CommissionsForm