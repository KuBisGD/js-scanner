/**
 * Module for the token buffer.
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

class TokenBuffer {
  /**
   * 
   */
  #internalBuffer

  /**
   * @type {string[]}
   */
  #currentBuffer

  #lastBuffer

  /**
   * Gets a copy of the current buffer
   * 
   * @returns {string[]} The buffer
   */
  get current () {
    return this.#currentBuffer.slice()
  }

  /**
   * Gets the length of the current buffer
   * 
   * @returns {number} The buffer length.
   */
  get length () {
    return this.#currentBuffer.length
  }

  constructor () {
    this.#internalBuffer = { default: [] }
    this.#currentBuffer = this.#internalBuffer.default
    this.#lastBuffer = this.#internalBuffer.default
  }

  /**
   * Adds new tokens to the current buffer
   * 
   * @param  {...string} tokens 
   */
  push (...tokens) {
    this.#currentBuffer.push(...tokens)
  }

  shift () {
    return this.#currentBuffer.shift()
  }

  setActive (name) {
    if (typeof this.#internalBuffer[name] === 'undefined') {
      this.#internalBuffer[name] = []
    }

    this.#lastBuffer = this.#currentBuffer
    this.#currentBuffer = this.#internalBuffer[name]
    return this
  }

  saveCurrentTo (name) {
    this.#internalBuffer[name] = [...this.#currentBuffer]
  }

  /**
   * Deletes a buffer from the stack.
   * 
   * @param {string} name Buffer name to be deleted
   */
  delete (name) {
    delete this.#internalBuffer[name]
  }

  /**
   * Clears this current buffer
   */
  clear () {
    this.#currentBuffer = []
  }
}

export default TokenBuffer
