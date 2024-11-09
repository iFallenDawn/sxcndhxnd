const exportedMethods = {
  checkId(id) {
    if (!id) throw "Error: You must provide an id to search for"
    if (typeof id !== "string") throw "Error: id must be a string"
    id = id.trim()
    if (id.length === 0) throw "Error: id cannot be an empty string or spaces"
    return id
  },
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`
    strVal = strVal.trim()
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
    return strVal
  },
  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`
      }
      arr[i] = arr[i].trim()
    }
    return arr
  },
  checkUsername(username) {
    this.checkString(username, "Username")
    if (!/^[a-zA-Z0-9]+$/g.test(username))
      throw `Error: Username contains illegal characters.`
    if (username.length < 8)
      throw `Error: Username must be at least 8 characters long.`
    return username.toLowerCase()
  },
  checkPassword(password) {
    this.checkString(password, "Password")
    if (/\s/g.test(password))
      throw `Error: Password contains illegal characters.`
    if (password.length < 8)
      throw `Error: Password must be at least 8 characters long.`
    return password
  },
  checkBoolean(bool) {
    if (bool === undefined) throw `Error: You must provide a valid bool`
    if (typeof bool !== "boolean") throw `Error: You must provide a valid bool`
    return bool
  },
  validateCommissionFields(reqBody) {
    return {
      firstName: this.checkString(reqBody.firstName, 'First Name'),
      lastName: this.checkString(reqBody.lastName, 'Last Name'),
      email: this.checkString(reqBody.email, 'Email'),
      commissionType: this.checkString(reqBody.commissionType, 'Commission Type'),
      pieceVision: this.checkString(reqBody.pieceVision, 'Piece Vision'),
      symmetryType: this.checkString(reqBody.symmetryType, 'Symmetry Type'),
      baseMaterial: this.checkString(reqBody.baseMaterial, 'Base Material'),
      creativeControl: this.checkString(reqBody.creativeControl, "Creative Control"),
      colors: this.checkString(reqBody.colors, "Colors"),
      fabrics: this.checkString(reqBody.fabrics, 'Fabrics'),
      shapePatterns: this.checkString(reqBody.shapePatterns, 'Shape Patterns'),
      distress: this.checkString(reqBody.distress, 'Distress'),
      retailor: this.checkString(reqBody.retailor, 'Retailor'),
      pockets: this.checkString(reqBody.pockets, 'Pockets'),
      weeklyChecks: this.checkString(reqBody.weeklyChecks, 'Weekly Checks'),
      extra: this.checkString(reqBody.extra, 'Extra')
    }
  },
  validateCommissionKey(str) {
    const commissionKeys = [
      'firstName',
      'lastName',
      'email',
      'commissionType',
      'pieceVision',
      'symmetryType',
      'baseMaterial',
      'creativeControl',
      'colors',
      'fabrics',
      'shapePatterns',
      'distress',
      'retailor',
      'pockets',
      'weeklyChecks',
      'extra'
    ]
    if (commissionKeys.includes(str))
      return true
    return false
  }
}

export default exportedMethods
