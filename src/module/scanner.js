/**
 * Module for Scanner.
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

import { EndOfFileError, RegExpDoesNotMatchError } from './internal/errors/scanner-errors.js'
import LineReader from './internal/line-reader.js'
import TokenBuffer from './internal/token-buffer.js'

/**
 * @typedef {import('./types/io-settings.js').IOSettings} IOSettings
 */

/**
 * @typedef {import('./types/number-range.js').NumberRange} NumberRange
 */

/**
 * @typedef {import('./types/string-match.js').StringMatch} StringMatch
 */

/**
 * Class for scanning an input stream and prompting an output stream.
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
   * @type {TokenBuffer}
   */
  #buffer

  /**
   * Creates a new scanner.
   * 
   * @param {IOSettings} [io=object] Scanner settings
   */
  constructor (io = {}) {
    const {
      input = process.stdin,
      output = process.stdout,
    } = io

    this.#lineReader = new LineReader(input)
    this.#output = output

    this.#buffer = new TokenBuffer()
  }

  /**
   * Reads the next line without affecting the token buffer.
   * 
   * @throws {EndOfFileError} If there is no more data to read.
   * @returns {Promise<string>} The next line.
   */
  async nextLine () {
    const line = await this.#lineReader.readLine()

    if (line === null) {
      throw new EndOfFileError('No more input')
    }

    return line
  }

  /**
   * Consumes the current token buffer.
   * 
   * @throws {EndOfFileError} If there is no more data to read.
   * @returns {Promise<string[]>} The next tokens in the buffer.
   */
  async nextTokens () {
    if (this.#buffer.length === 0) {
      await this.#fillBuffer()
    }

    const buffer = this.#buffer.current
    this.#buffer.clear()
    return buffer
  }

  /**
   * Waits for any next input.
   */
  async pauseUntilNext () {
    await this.#lineReader.readLine()
  }

  /**
   * Reads the next number.
   * 
   * @param {NumberRange} [range=object] Filter input for range.
   * @throws {TypeError} If next token is not a valid number.
   * @throws {RangeError} If number is not within given range, or if range values are not finite.
   * @throws {EndOfFileError} If there is no more data to read.
   * @throws {TypeError} If range values are not numbers.
   * @returns {Promise<number>} The next number.
   */
  async nextNumber (range = {}) {
    const token = await this.next()

    const number = this.#parseNumberStrict(token)

    if (!this.#numberIsInRange(number, range)) {
      throw new RangeError(`Number ${number} must be in range: min:${range.min} max:${range.max}`)
    }

    return number
  }

  /**
   * Gets the next string from the buffer.
   * 
   * @param {StringMatch} [match=object] Pattern for matching the next string.
   * @throws {RangeError} If the provided string length is outside the allowed range, or the range values are not finite.
   * @throws {RegExpDoesNotMatchError} If input does not match given pattern.
   * @throws {EndOfFileError} If there is no more data to read.
   * @throws {TypeError} If range values are not numbers.
   * @returns {Promise<string>} The next string.
   */
  async nextString (match = {}) {
    const { pattern } = match
    const token = await this.next()

    if (pattern instanceof RegExp) {
      if (!pattern.test(token)) {
        throw new RegExpDoesNotMatchError(`'${token}' does not match ${pattern}`)
      }
    } else if (pattern !== undefined) {
      throw new TypeError('Pattern must be of type RegExp or undefined')
    }

    if (!this.#numberIsInRange(token.length, match)) {
      throw new RangeError(`Length of '${token}' must be in range: min:${match.min} max:${match.max}`)
    }

    return token
  }

  /**
   * Return the next token from the buffer.
   * 
   * @throws {EndOfFileError} If there is no more data to read.
   * @returns {Promise<string>} The next token from the buffer.
   */
  async next () {
    if (this.#buffer.length === 0) {
      await this.#fillBuffer()
    }

    return this.#buffer.shift()
  }

  /**
   * Checks if the buffer has more tokens.
   * 
   * @returns {boolean} Whether the buffer has more items
   */
  hasNext () {
    if (this.#buffer.length > 0) return true

    if (this.#lineReader.length > 0) {
      for (const line of this.#lineReader.previewQueue()) {
        if (this.#tokenize(line).length > 0) return true
      }
    }

    return false
  }

  /**
   * Writes a message to the output.
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
    this.#buffer.clear()
    this.#lineReader.clearQueue()
    return this
  }

  /**
   * Sets the current buffer. Creates it if it does not exits.
   * 
   * @param {string} name The name of the buffer.
   * @returns {Scanner} Reference to this Scanner.
   */
  useBuffer (name) {
    this.#buffer.setActive(name)
    return this
  }

  /**
   * Saves the current buffer to a new one.
   * 
   * @param {string} name Name to save as
   * @returns {Scanner} Reference to this Scanner.
   */
  saveBuffer (name) {
    this.#buffer.saveCurrentTo(name)
    return this
  }
  
  /**
   * Pushes the current buffer and creates a snapshot of it.
   * 
   * @returns {Scanner} Reference to this Scanner.
   */
  pushBuffer () {
    this.#buffer.pushBuffer()
    return this
  }

  /**
   * Restores the last pushed buffer to the current buffer.
   * 
   * @throws {Error} If there are no buffers to pop.
   * @returns {Scanner} Reference to this Scanner.
   */
  popBuffer () {
    this.#buffer.popBuffer()
    return this
  }

  /**
   * Removes a buffer by name, if it is the current the default buffer is set as active.
   * 
   * @param {string} name Name of buffer to remove.
   * @returns {Scanner} Reference to this Scanner.
   */
  removeBuffer (name) {
    this.#buffer.delete(name)
    return this
  }

  /**
   * Strictly parses a string to a number.
   * 
   * @param {string} token String to be validates as number
   * @returns {number} The parsed value.
   * @throws {TypeError} If token cannot be parsed as a valid number.
   */
  #parseNumberStrict (token) {
    const [mantissa, exponent, ...extra] = token.toLowerCase().split('e')
    const validMantissa = /^[-+]?\d+$/.test(mantissa) ||
      /^[-+]?\d+\.\d*$/.test(mantissa) ||
      /^[-+]?\.\d+$/.test(mantissa)
    const validExponent = exponent === undefined || /^[-+]?\d+$/.test(exponent)

    if (extra.length > 0 || !validMantissa || !validExponent) {
      throw new TypeError(`Expected number got '${token}'`)
    }

    const number = Number.parseFloat(token)

    if (Number.isNaN(number)) {
      throw new TypeError(`'${token}' could not be converted to number`)
    }

    return number
  }

  /**
   * Validates an optional numeric range bound.
   * 
   * @param {number} number Number to be validated.
   * @param {NumberRange} range Range to be validated against.
   * @throws {TypeError} If range values are not numbers.
   * @throws {RangeError} If range values are not finite. 
   * @returns {boolean} If number is in range.
   */
  #numberIsInRange (number, range = {}) {
    const { min, max } = range

    if (min !== undefined) this.#validateRangeBound(min, 'min')
    if (max !== undefined) this.#validateRangeBound(max, 'max')

    if (min !== undefined && min > number) return false
    if (max !== undefined && max < number) return false

    return true
  }

  /**
   * Validates if a number should be used in a range
   * 
   * @param {number | undefined} value Value to be validated.
   * @param {string} name Name of the value to be validated.
   * @throws {TypeError} If value is not a number.
   * @throws {RangeError} If the value is not finite.
   * @returns {void}
   */
  #validateRangeBound (value, name) {
    if (typeof value !== 'number') {
      throw new TypeError(`${name} must be a number; got "${typeof value}"`)
    }

    if (!Number.isFinite(value)) {
      throw new RangeError(`${name} must be finite`)
    }
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
   * @returns {Promise<void>} True on success.
   */
  async #fillBuffer () {
    while (true) {
      const line = await this.#lineReader.readLine()

      if (line === null) {
        throw new EndOfFileError('No more inputs')
      }

      const tokens = this.#tokenize(line)

      if (tokens.length > 0) {
        this.#buffer.push(...tokens)
        return
      }
    }
  }
}

export default Scanner
