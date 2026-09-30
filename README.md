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

### `new Scanner(io?: { input?: Node.ReadableStream, output?: Node.WritableStream })`

Creates a scanner. Both streams default to `process.stdin` and `process.stdout`.

### `nextLine(): Promise<string>`

Reads the next complete line. Throws `EndOfFileError` when the input stream has ended.

### `next(): Promise<string>`

Reads the next whitespace-separated token. Throws `EndOfFileError` when no more input is available.

### `nextTokens(): Promise<string[]>`

Reads the remaining tokens in the next non-empty input line. Throws `EndOfFileError` when no more input is available.

### `nextNumber(range?: { min?: number, max?: number }): Promise<number>`

Reads a number, optionally bounded by `min` and `max`.

- Throws `EndOfFileError` when input ends.
- Throws `TypeError` when the token is not a valid number.
- Throws `RangeError` when the number is outside the specified bounds.

### `nextString(match?: { min?: number, max?: number, pattern?: RegExp }): Promise<string>`

Reads a string, optionally checking its length and pattern.

- Throws `EndOfFileError` when input ends.
- Throws `RegExpDoesNotMatchError` when the string does not match `pattern`.
- Throws `RangeError` when its length is outside the specified bounds.

### `pauseUntilNext(): Promise<void>`

Waits for and consumes the next input line.

### `prompt(message: string): Scanner`

Writes a prompt and returns the scanner.

### `hasNext(): boolean`

Checks whether buffered input is available.

### `clearInput(): Scanner`

Clears buffered tokens and queued input, then returns the scanner.

### `useBuffer(name: string): void`

Switches to the named buffer, creating it if needed.

### `saveBuffer(name: string): void`

Copies the current buffer to the named buffer.

### `pushBuffer(): void`

Saves a snapshot of the current buffer.

### `popBuffer(): void`

Restores the most recently saved snapshot. Throws `Error` when there is no snapshot to restore.

### `removeBuffer(name: string): void`

Removes the named buffer. Throws `Error` when asked to remove the default buffer.