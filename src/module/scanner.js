/**
 * Module for Scanner.
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

/**
 * An input scanner.
 */
class Scanner {
  /**
   * @type {Node.ReadableStream}
   */
  #input

  /**
   * @type {Node.WritableStream}
   */
  #output

  /**
   * @type {Array}
   */
  #buffer

  /**
   * Creates a new scanner.
   * 
   * @param {NodeJS.ReadableStream} input Input stream.
   * @param {NodeJS.WritableStream} output Output stream.
   */
  constructor (input, output) {
    this.#input = input
    this.#output = output
  }

  /**
   * Reads the next line.
   */
  async nextLine () {
    throw new Error('Not implemented')
  }

  /**
   * Reads the next number.
   */
  async nextNumber () {
    throw new Error('Not implemented')
  }

  /**
   * Gets the next character.
   */
  async nextChar () {
    throw new Error('Not implemented')
  }

  /**
   * Prompt a message before an input-
   * 
   * @param {string} message A message to prompt the output.
   * @returns {Scanner} Reference to this Scanner.
   */
  prompt (message) {
    console.log(message) // temp? use NodeJS.WritableStream
    return this
  }

  async #fillBuffer () {
    // check eof

    let line = ''

    try {
      // line = await some input method

    } catch {
      // eof
      return false
    }

    if (line === null | line === undefined) {
      // eof
      return false
    }

    const trimmed = line.trim()

    const tokens = [] //create tokens()

    if (tokens.length === 0) {
      return await this.#fillBuffer()
    }

    this.#buffer.push(...tokens)

    return true
  }
}

export default Scanner
