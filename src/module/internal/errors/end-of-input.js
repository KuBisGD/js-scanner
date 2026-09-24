

class EndOfInputError extends Error {
  constructor (message) {
    super(message)
    this.name = 'EndOfInputError'
  }
}