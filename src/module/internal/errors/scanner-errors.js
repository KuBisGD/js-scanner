/**
 * Module for Scanner errors
 * 
 * @author Edwin Johnsson ej224wy@student.lnu.se
 * @version 1.0.0
 */

/**
 * Error for reaching the end of the input.
 */
export class EndOfFileError extends Error {
  /**
   * Creates a new EOF error.
   * 
   * @param {string} message Message to be displayed with the error.
   */
  constructor (message) {
    super(message)
    this.name = 'EndOfFileError'
  }
}

/**
 * Error for a string not matching a regular expression.
 */
export class RegExpDoesNotMatchError extends Error {
  /**
   * Creates a new regular-expression-mismatch error.
   * 
   * @param {string} message Message to be displayed with the error.
   */
  constructor (message) {
    super(message)
    this.name = 'RegExpDoesNotMatchError'
  }
}
