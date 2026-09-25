/**
 * Module for the token buffer.
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

/**
 * Class for multiple string arrays of tokens.
 */
class TokenBuffer {
  static DEFAULT_BUFFER_NAME = 'default'

  /**
   * @type {{[key: string]: string[]}}
   */
  #internalBuffers = {}

  /**
   * @type {string[]}
   */
  #currentBufferName

  /**
   * @type {string[][]}
   */
  #bufferStack = []

  /**
   * Gets a copy of the current buffer
   * 
   * @returns {string[]} The buffer
   */
  get current () {
    return [...this.#getCurrent()]
  }

  /**
   * Gets the length of the current buffer
   * 
   * @returns {number} The buffer length.
   */
  get length () {
    return this.#getCurrent().length
  }

  /**
   * Creates a new token buffer.
   */
  constructor () {
    this.#internalBuffers[TokenBuffer.#DEFAULT_BUFFER_NAME] = []
    this.#currentBufferName = TokenBuffer.#DEFAULT_BUFFER_NAME
  }

  /**
   * Adds new tokens to the current buffer
   * 
   * @param  {...string} tokens Tokens to push 
   */
  push (...tokens) {
    this.#getCurrent().push(...tokens)
  }

  /**
   * Shifts a token from the current buffer.
   * 
   * @returns {string[]} The token.
   */
  shift () {
    return this.#getCurrent().shift()
  }

  /**
   * Sets a new buffer as active, creates it if it does not exits.
   * 
   * @param {string} name The name of the buffer to set as active.
   */
  setActive (name) {
    if (typeof this.#internalBuffers[name] === 'undefined') {
      this.#internalBuffers[name] = []
    }

    this.#currentBufferName = name
  }

  /**
   * Saves the current buffer under a new name.
   * 
   * @param {string} name Name to save to.
   */
  saveCurrentTo (name) {
    this.#internalBuffers[name] = [...this.#getCurrent()]
  }

  /**
   * Deletes a buffer from the stack. (switches to default buffer if current is removed)
   * 
   * @param {string} name Buffer name to be deleted
   * @throws {Error} If name is the default buffer.
   */
  delete (name) {
    if (name === TokenBuffer.#DEFAULT_BUFFER_NAME) {
      throw new Error('Cannot remove the default buffer')
    }

    delete this.#internalBuffers[name]

    if (name === this.#currentBufferName) {
      this.setActive(TokenBuffer.#DEFAULT_BUFFER_NAME)
    }
  }

  /**
   * Clears this current buffer
   */
  clear () {
    this.#internalBuffers[this.#currentBufferName] = []
  }

  /**
   * Pushes the current buffer and creates a snapshot of it.
   */
  pushBuffer () {
    const snapshot = [...this.#getCurrent()]
    this.#bufferStack.push(snapshot)
  }

  /**
   * Restores the last pushed buffer to the current buffer
   * 
   * @throws {Error} If there are no buffers to pop.
   */
  popBuffer () {
    if (this.#bufferStack.length === 0) {
      throw new Error('No buffers to pop')
    }

    this.#internalBuffers[this.#currentBufferName] = this.#bufferStack.pop()
  }

  /**
   * Helper method to get the current buffer.
   * 
   * @returns {string[]} Reference to the current buffer.
   */
  #getCurrent() {
    return this.#internalBuffers[this.#currentBufferName]
  }
}

export default TokenBuffer
