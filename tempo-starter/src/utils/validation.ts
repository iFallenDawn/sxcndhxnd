import validator from 'validator'

const exportedMethods = {
  checkId(id: string): string {
    if (!id) throw `Error: You must provide an id to search for`
    id = id.trim()
    if (!validator.isUUID(id)) throw `Error: Invalid id`
    return id
  },
  checkString(strVal: string, varName: string): string {
    if (!strVal) throw `Error: ${varName} must be a string`
    strVal = validator.trim(strVal)
    if (strVal.length === 0) throw `Error: ${varName} cannot be an empty string`
    return strVal
  },
  checkBoolean(bool: string): boolean {
    if (!validator.isBoolean(bool)) throw `Error: ${bool} is not a boolean`
    return JSON.parse(bool)
  },
  checkEmail(email: string): string {
    if (!validator.isEmail(email)) throw `Error: ${email} is not a valid email`
    return email.toLowerCase()
  }
}

export default exportedMethods