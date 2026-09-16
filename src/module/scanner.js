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
   * 
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
}

export default Scanner
