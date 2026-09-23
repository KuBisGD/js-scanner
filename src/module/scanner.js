/**
 * Module for Scanner.
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

import LineReader from './internal/line-reader.js'

/**
 * An input scanner.
 * 
 * @todo Document where errors are thrown. (look at eof)
 */
class Scanner {

  /**
   * @type {LineReader}
   */
  #lineReader

  /**
   * @type {Node.WritableStream}
   */
  #output


  /**
   * @type {string[]}
   */
  #buffer = []

  /**
   * Creates a new scanner.
   * 
   * @param {import('./types/io-settings.js').IOSettings} [io=object] Scanner settings
   */
  constructor (io = {}) {
    const {
      input = process.stdin,
      output = process.stdout,
    } = io

    this.#lineReader = new LineReader(input)
    this.#output = output
  }

  /**
   * Reads the next line.
   * 
   * @returns {string} The next line.
   */
  async nextLine () {
    this.#buffer = []

    const line = await this.#lineReader.readLine()

    if (line === null) {
      this.eof = true
      throw new Error('No more input')
    }

    return line
  }

  /**
   * Reads the next number.
   * 
   * @param {import('./types/number-range.js').NumberRange} [range=object] Filter input for range.
   * @throws {Error} If next token is not a valid number or is not in valid range.
   * @returns {number} The next number.
   */
  async nextNumber (range = {}) {
    const { min, max } = range

    const token = await this.next()

    const number = this.#parseNumberStrict(token)

    if (!this.#numberIsInRange(number, range)) {
      throw new Error(`Number ${number} must be in range: min:${min} max:${max}`)
    }

    return number
  }

  /**
   * Gets the next String.
   * 
   * @param {RegExp|undefined} [pattern=undefined] Pattern for matching the next string.
   * @returns {Promise<string>} The next string.
   */
  async nextString (pattern = undefined) {
    throw new Error('Not implemented')
  }

  /**
   * Return the next token from the buffer.
   * 
   * @returns {Promise<string | undefined>} The next token from the buffer.
   */
  async next () {
    if (this.#buffer.length === 0) {
      const ok = await this.#fillBuffer()
      if (!ok) {
        throw Error('No more input')
      }
    }

    return this.#buffer.shift()
  }

  /**
   *  Checks if the buffer has more tokens.
   * 
   * @returns {boolean} Whether the buffer has more items
   */
  hasNext () {
    return this.#buffer.length > 0 || this.#lineReader.length > 0
  }

  /**
   * Prompt a message to the output.
   * 
   * @param {string} message A message to prompt the output.
   * @returns {Scanner} Reference to this Scanner.
   */
  prompt (message) {
    this.#output.write(message)
    return this
  }

  /**
   * Clears any tokens and leftover inputs.
   * 
   * @returns {Scanner} Reference to this Scanner.
   */
  clearInput () {
    this.#buffer = []
    this.#lineReader.clearQueue()
    return this
  }

  /**
   * Strictly parses a string to a number.
   * 
   * @param {string} token String to be validates as number
   * @returns {number} The parsed value.
   * @throws {Error} If token cannot be parsed as a valid number.
   */
  #parseNumberStrict (token) {
    const [mantissa, exponent, ...extra] = token.toLowerCase().split('e')
    const validMantissa = /^[-+]?\d+$/.test(mantissa) ||
      /^[-+]?\d+\.\d*$/.test(mantissa) ||
      /^[-+]?\.\d+$/.test(mantissa)
    const validExponent = exponent === undefined || /^[-+]?\d+$/.test(exponent)

    if (extra.length > 0 || !validMantissa || !validExponent) {
      throw new Error(`Expected number got '${token}'`)
    }

    const number = Number.parseFloat(token)

    if (Number.isNaN(number)) {
      throw new Error(`'${token}' could not be converted to number`)
    }

    return number
  }

  /**
   * Checks if a value is in a given range.
   * 
   * @param {number} number Number to be validated.
   * @param {import('./types/number-range.js').NumberRange} range Range to be validated against.
   * @returns {boolean} If number is in range.
   */
  #numberIsInRange (number, range = {}) {
    const { min, max } = range

    if (typeof min === 'number') {
      if (min > number) return false
    }

    if (typeof max === 'number') {
      if (max < number) return false
    }

    return true
  }

  /**
   * Creates tokens from a line.
   * 
   * @param {string} line Line to be turned into tokens.
   * @returns {string[]} Tokens from line.
   */
  #tokenize (line) {
    const trimmed = line.trim()

    if (trimmed.length === 0) {
      return []
    }

    const rawTokens = trimmed.split(/\s+/)

    return rawTokens.filter(token => token.length > 0)
  }

  /**
   * Fills the buffer with tokens
   * 
   * @returns {Promise<boolean>} True on success.
   */
  async #fillBuffer () {
    const line = await this.#lineReader.readLine()

    if (line === null) {
      this.eof = true
      return false
    }

    const tokens = this.#tokenize(line)

    this.#buffer.push(...tokens)

    return tokens.length > 0
  }
}

export default Scanner
