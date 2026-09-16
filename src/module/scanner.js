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
   * @type {Node.WritableStream}
   */
  #output


  /**
   * @type {string[]}
   */
  #buffer

  /**
   * Creates a new scanner.
   * 
   * @param {import('./types/io-settings.js').IOSettings} io Scanner settings
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
      return new Error('No more input')
    }

    return line
  }

  /**
   * Reads the next number.
   * 
   * @param {import('./types/number-range.js').NumberRange|undefined} [range=undefined] Filter input for range. 
   */
  async nextNumber (range = undefined) {
    console.log(range)
    throw new Error('Not implemented')
  }

  /**
   * Gets the next character.
   */
  async nextChar () {
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
   * Prompt a message before an input.
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

/**
 * Class for reading a readable stream.
 */
class LineReader {
  /**
   * @type {readline.Interface}
   */
  #readLine

  /**
   * @type {null|(value: string | void) => void}
   */
  #resolveNext = null

  /**
   * @type {string[]}
   */
  #queue = []

  /**
   * Gets the length of the LineReaders internal queue.
   * 
   * @returns {number} The length.
   */
  get length () {
    return this.#queue.length
  }

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
   * @returns {Promise<string | null>} Line.
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
