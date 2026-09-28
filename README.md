# @kubis/input-scanner

A Node.js ES module for reading lines and whitespace-separated tokens from an input stream.

## Install

```sh
npm install @kubis/input-scanner
```

## Usage

```js
import Scanner from '@kubis/input-scanner'

const scanner = new Scanner()
scanner.prompt('Enter a number: ')

const value = await scanner.nextNumber()
console.log(`You entered ${value}`)
```

By default, the scanner reads from `process.stdin` and writes prompts to `process.stdout`. Pass `{ input, output }` to the constructor to use different Node.js streams.

## API

- `nextLine()` reads the next complete line.
- `next()` reads the next whitespace-separated token.
- `nextTokens()` reads the remaining tokens from the current line.
- `nextNumber({ min, max })` reads a number and optionally enforces a range.
- `nextString({ min, max, pattern })` reads a string and optionally validates its length and regular-expression pattern.
- `prompt(message)` writes a prompt and returns the scanner.
- `hasNext()` checks whether buffered input is available.
- `clearInput()` clears buffered input.

Reading beyond the end of the input rejects with `EndOfFileError`.