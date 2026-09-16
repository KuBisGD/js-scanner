import Scanner from './src/module/scanner.js'

/**
 * main
 */
const main = async () => {
  const scanner = new Scanner(process.stdin, process.stdout)

  console.log('testing\n')
  let line = await scanner.nextLine()

  console.log(line)

  setTimeout(async () => {
    console.log('testing - 2\n')
    line = await scanner.nextLine()

    console.log(line)
  }, 3000)

  
}

main()
