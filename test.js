import Scanner from './src/module/scanner.js'

/**
 * main
 */
const main = async () => {
  const scanner = new Scanner()

  const name = await scanner.nextString({ min: 1 })

  console.log('hello', name)

  scanner.pushBuffer()
  console.log(scanner.hasNext())
  scanner.clearInput()
  console.log(scanner.hasNext())
  scanner.popBuffer()
  console.log(scanner.hasNext())

  console.log(await scanner.next())

  scanner.popBuffer()
}

main()
