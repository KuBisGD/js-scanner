/**
 * Module for Scanner errors
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

/**
 * Error for no more inputs.
 */
export class EndOfFileError extends Error {
  /**
   * Creates a new eof error.
   * 
   * @param {string} message Message to be displayed with the error.
   */
  constructor (message) {
    super(message)
    this.name = 'EndOfInputError'
  }
}

/**
 * Error for not matching a regular expression.
 */
export class RegExpDoesNotMatchError extends Error {
  /**
   * Creates a new eof error.
   * 
   * @param {string} message Message to be displayed with the error.
   */
  constructor (message) {
    super(message)
    this.name = 'RegExpDoesNotMatchError'
  }
}
