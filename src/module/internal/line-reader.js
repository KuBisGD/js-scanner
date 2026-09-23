/**
 * Module for LineReader class
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

import readline from 'node:readline'

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

    this.#readLine.on('line', line => this.#onLine(line))

    this.#readLine.on('close', () => this.#onClose())
  }


  /**
   * Reads the next input from the input queue.
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

  #onLine (line) {
    if (this.#resolveNext) {
      this.#resolveNext(line)
      this.#resolveNext = null
    } else {
      this.#queue.push(line)
    }

    console.log(this.#queue)
  }

  #onClose () {
    if (this.#resolveNext) {
      this.#resolveNext(null)
    }
  }
}

export default LineReader
