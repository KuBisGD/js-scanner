import Scanner from './src/module/scanner.js'

/**
 * main
 */
const main = async () => {
  const scanner = new Scanner()

  console.log('testing\n')
  let line = await scanner.prompt('Enter a name: ').nextNumber({ min: 5, max: 10 })

  console.log(line)

  console.log(await scanner.next())

  setTimeout(async () => {
    console.log('testing - 2\n')

    line = await scanner.clearInput().nextLine()

    console.log(line)
  }, 3000)

  
}

main()
