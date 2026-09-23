import Scanner from './src/module/scanner.js'

/**
 * main
 */
const main = async () => {
  const scanner = new Scanner()

  console.log('testing\n')
  
  let line = await scanner.prompt('Enter a name: ').nextString({ pattern: /([A-Z])\w+/, min: 5 })

  console.log(line)

  console.log(await scanner.next())



  setTimeout(async () => {
    console.log('testing - 2\n')

    line = await scanner.clearInput().nextLine()

    console.log(line)

    scanner.clearInput().pauseUntilNext()
  }, 3000)

  console.log('k')
}

main()
