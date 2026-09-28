import Scanner from './src/module/scanner.js'

/**
 * main test demo
 */
const main = async () => {
  const scanner = new Scanner()

  scanner.useBuffer('user-info')

  const name = await scanner.prompt('Enter name: ')
    .nextLine()
  
  console.log(`Name is set to: ${name}`)

  const age = await scanner.prompt('Enter age as number: ')
    .nextNumber({ min: 0, max: 150 })

  console.log(`${name} is ${age} years old.`)

  const words = await scanner.prompt('Type 3 words on one line: ')
    .nextTokens()

  console.log('Words', words)

  await scanner.prompt('Press enter to continue...\n')
    .pauseUntilNext()

  console.log('Switching buffer...')
  scanner.useBuffer('temp')

  const firstWord = await scanner.prompt('Enter 3 more words: ')
    .nextString()

  console.log('----------------------------')
  
  console.log(`First word was: ${firstWord} and there is more in buffer: ${scanner.hasNext()}`)

  console.log('Switching back buffer...')
  scanner.useBuffer('user-info')
  console.log(`There is more in buffer: ${scanner.hasNext()}`)

  console.log('----------------------------')

  console.log('Removing temp buffer and switching back to it.')
  scanner.removeBuffer('temp')
  scanner.useBuffer('temp')
  console.log(`There is more in buffer: ${scanner.hasNext()}`)
}

main()
