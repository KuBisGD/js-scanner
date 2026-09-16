/**
 * Module for Scanner.
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

import readline from 'node:readline'

/**
 * An input scanner.
 */
class Scanner {

  /**
   * @type {LineReader}
   */
  #lineReader


  /**
   * @type {string[]}
   */
  #buffer

  /**
   * Creates a new scanner.
   * 
   * @param {Node.ReadableStream} input Input stream.
   * @param {Node.WritableStream} output Output stream.
   */
  constructor (input) {
    this.#lineReader = new LineReader(input)
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
      return new Error('No more input')
    }

    return line
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

/**
 * Object for reading a readable stream.
 */
class LineReader {
  #readLine

  #resolveNext = null

  #queue = []
  /**
   * Create a new line reader.
   * 
   * @param {Node.ReadableStream} input Input method.
   */
  constructor (input = process.stdin) {
    this.#readLine = readline.createInterface({ input })

    this.#readLine.on('line', line => {
      if (this.#resolveNext) {
        this.#resolveNext(line)
        this.#resolveNext = null
      } else {
        this.#queue.push(line)
      }

      console.log(this.#queue)
    })

    this.#readLine.on('close', () => {
      if (this.#resolveNext) {
        this.#resolveNext(null)
      }
    })
  }


  /**
   * Reads the input ReadableStream.
   * 
   * @returns {Promise<string | void>} Line.
   */
  async readLine () {
    if (this.#queue.length > 0) {
      return this.#queue.shift()
    }

    return new Promise(resolve => {
      this.#resolveNext = resolve
    })
  }

  /**
   * Clears the internal input queue.
   */
  clearQueue () {
    this.#queue = []
  }
}

export default Scanner
