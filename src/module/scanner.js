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
   * @type {Node.ReadableStream}
   */
  #input

  #lineReader

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
    this.#lineReader = new LineReader(input)
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

  /**
   * 
   * @param {string} line 
   * @returns 
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

class LineReader {
  #readLine

  #resolveNext = null

  #queue = []
  /**
   * Create a new line reader.
   * 
   * @param {NodeJS.ReadStream} input Input method.
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
    })

    this.#readLine.on('close', () => {
      if (this.#resolveNext) {
        this.#resolveNext(null)
      }
    })
  }

  async readLine () {
    if (this.#queue.length > 0) {
      return this.#queue.shift()
    }

    return new Promise(resolve => {
      this.#resolveNext = resolve
    })
  }
}

export default Scanner
