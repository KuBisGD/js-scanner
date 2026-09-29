# Reflektion: Laboration 2 – Skriv en modul, inte en app

<!--
    Komplettera filen och lämna in den tillsammans med din Merge Request.
    Du får skriva på svenska eller engelska.

    Avsnitt 1–3 innehåller de fem reflektioner som uppgiften kräver: två tabeller, två
    kapitelreflektioner och en reflektion över din egen kodkvalitet. Avsnitt 4–5 besvarar du också.
-->

## 1. Namngivning

<!--
    Välj fem namn på identifierare (t.ex. klasser, metoder, variabler) från modulens publika
    interface, alltså den kod som andra programmerare ska använda. Ange de viktigaste "reglerna" från
    kapitel 2 (2:a upplagan: kapitel 4) som applicerats, eller skulle kunna appliceras, på varje namn.
    Variera vilka regler du använder mellan namnen.
-->

| Namn | Förklaring | Reflektion och regler från Clean Code |
| ---- | ---------- | -------------------------------------- |
| `Scanner` | Name of main module | **Use Pronounceable Names**: Scanner is a word in the english language and works as a **class name** since it is a noun. **Don't be cute**: The name in this context is technically a nod to the Scanner class in javas.utils and while the name is not *wrong* a name like inputScanner may have been better. But at the same time, the class also knows of the output stream. |
| `Scanner.pushBuffer()` | Name of method to create snapshot of a buffer | **Use Solution Domain Names**: The meaning of push in the context of this method does not refer to physically shoving something but rather adding the current buffer to the top of the internal buffer stack. **Use Intention-Revealing Names**: By utilizing *Solution Domain Names* in the method naming it becomes clear what the method intends to do. |
| `Scanner.nextLine()` | Name of method that gets the next line | **Pick One Word per Concept**: All the main methods of the scanner which intend on acquiring data/tokens from the scanner use the next prefix to describe this concept. So while the methods `.nextNumber()` and `.nextString()` both do different actions, there relative goal and results are the same. **Make Meaningful Distinctions**: The method name makes a distinction between itself and the other *next* methods by specifying that it gets the next line unlike `.nextNumber()` that will only get the next number. The name also does not include words that could be redundant like *nextLineUntilNewLine* or *nextFullLine* it just gets the next line. |
| `Scanner.removeBuffer(name: string)` | Name of method that removes a buffer by name | **Pick One Word per Concept**: This concept returns in this but this time in a more dubious manor. While the public api does not break this rule it does conflict with the internal buffer which does not call `.remove()` but rather `.delete()`. **Add Meaningful Context**: While the name of the method could have been `.remove()` with the parameter of `bufferName: string` a name with more information was used to allow the user to **Avoid Mental Mapping**. |
| `Scanner.useBuffer(name: string)` | Name of method that switches to another buffer | **Avoid Disinformation**: The word use here is used to describe the action of switching to or creating and switching to a new buffer. But the name itself is not *wrong* since the `Scanner` does in fact now use the named buffer, it is just removing the extra layer of buffer creation. So while the name is not wrong it could be missing some context. |

*Upptäckte du någon brist i din egen namngivning när du läste kapitlet om namngivning? Höll du med
om alla "reglerna", eller finns det någon du ifrågasätter?*

Svar:

I do find myself to agree mostly with all the rules of the book and while i like to believe that i normally code in a similar fashion some slipups do happen. One of the internal classes, `TokenBuffer` has a method named `clear()` but the context of what is cleared is not presented without reading de jsdoc for the method. The `clear()` call does in fact not clear the entire buffer but only the one that is currently in use ex. `'default'` or `'test-buffer'`, and leaving this context to the documentation is a not to infrequent occurrence. My naming is what could be considered as using **Searchable Names** since i rarely use single letter names or abbreviations outside of for-loops and some one of situations like a quick test snippet. The rules i follow when naming variables boils down to: as short as is reasonable with the information that is required to understand its propose.

I find myself especially agreeing with **Avoid Encodings** such as not using **Hungarian Notation** and **Member Prefixes** since it has no real place with modern tools and newer language, whenever possible use `this.name` over `m_name`.

The one rule that i do not fully agree with is the naming of classes. Since yes, classes should mostly be nouns like `User`, `Customer`, or `Scanner` i also think classes could have name prefixes like manager and data. This comes form my experience writing in languages with weaker types and the want to add type safety the collections of data like a `GameData` class that explicitly sets and requires different types of data to be present, but the game itself does not need to know about the data (i get that this relation is a bit unclear but i have had this problem and it works for the argument). 

## 2. Funktioner

<!--
    Välj dina fem längsta metoder/funktioner. Ange de viktigaste reglerna från kapitel 3
    (2:a upplagan: kapitel 7–11) som följs eller bryts, och föreslå förändringar.
-->

| Metodnamn | Länk eller kod | Antal rader (ej ws) | Reflektion (regler som följs/bryts, föreslagna förändringar) |
| --------- | --------------- | -------------------- | ------------------------------------------------------------ |
| `Scanner.#parseNumberStrict(token: string)` |  | ~13 | **Use Descriptive Names**: The method takes a string (**Monadic**) and parses it as a number but the strict part indicating that it is more strict than JavaScripts normal string to number parsing. **Common Monadic Forms**: Since we give the method one value and that value is being operated on, then returned as a transformed value and not an **Output Argument**. **Verbs and Keywords**: The method name follows verb -> noun with parse -> number but adds strict to the end to separate it from the built in `parseNumber` function. **Prefer Exceptions to Returning Error Codes**: Then an invalid number is given to the method, a `TypeError` is thrown rather than returning an error value. **Do One Thing**: In this method it could be argued that it does two things, validate that the string is a valid number in string form and then parses it to a number. This could be improved by separating the validation logic into a smaller method like `Scanner.#isValidNumber(token: string)`. |
| `Scanner.#fillBuffer()` |  | 11 | **Don’t Repeat Yourself**: This method is in some form used by every other method that requires the buffer to contain tokens of any kind. `Scanner.#fillBuffer()` separates this logic and puts it in one place for easier management. **Function Arguments** This method has no argument and is therefore **niladic**, this is because the line reader and the token buffer that he method uses are available as private members on the `Scanner` class. **Have No Side Effects**: While this method does call `LineReader.readLine()` which empties its queue it is not a **side**effect since it is the goal of the method take this next line, turn it into tokens, and then but them into the buffer. *Potential Improvements*: This method along with some other call `this.#lineReader.readLine()` and some buffer methods, this could be separated into their own methods in case this implementation changes in the future. |
| `Scanner.nextString(match: object)` |  | 11 | **Don’t Repeat Yourself**: This method calls the lower level ´Scanner.next()´ method like som other *next of type* method to not have to repeat the logic multiple times. Instead the method is only concerned with validating this string against optional filters (**Do One Thing**). There are three potential filters available that would have turned the method into a **Triad** were it not for the use of an **Argument Object**. This object is used since all three arguments are optional this is how named arguments are implemented in JavaScript. This vastly improves the readability from `Scanner.nextString(undefined, undefined, 10)` to `Scanner.nextString({ max: 10 })` |
| `Scanner.nextTokens()` |  | 9 |  |
| `Scanner.#numberIsInRange()` |  | 9 |  |

*Upptäckte du någon brist i hur du tidigare skrivit funktioner/metoder när du läste kapitlet om
funktioner? Höll du med om alla "reglerna", eller finns det någon du ifrågasätter?*

Svar:

## 3. Din kodkvalitet

*Beskriv dina erfarenheter av att arbeta med din egen kodkvalitet i den här laborationen. Använd
begrepp från kursboken. (Cirka 250 ord.)*

Svar:

## 4. Att skriva en modul

*Hur var det att skriva kod för andra programmerare istället för en app med egna slutanvändare?
Ändrades din USP (som du beskriver i `README.md` på GitHub) under arbetets gång, och i så fall
varför?*

Svar:

## 5. AI-samarbete

*Beskriv kort vilka delar av inlämningen du tagit fram tillsammans med AI-assistenter (t.ex.
ChatGPT, GitHub Copilot, Claude), och hur. Har du inte använt AI-assistenter, skriv det.*

Svar:

AI was mainly used in the creation of this module during the conceptual planing phase. In other word it was used to figure out what could be done as a module based of some of my ideas and the what functionality the module itself should and should not have. Basically some architectural decisions was weighed against it to better find the ups, downs, and consequences of some decisions like should `nextLine()` clear the buffer or if there is something left return it. Throughout the development AI was used closely resembling a search engine with the added benefit of having access to the code the searching is about while also helping locate missing informations in my documentation.
AI was also a big part in creating the unit tests for the module, creating a majority of them. These tests and the `Scanner.#parseNumberStrict()` is the only code explicitly created by AI.

*Använde du AI-assistenter annorlunda i den här laborationen jämfört med laboration 1 — nu när
uppgiften är en större, mer kvalitetskänslig modul snarare än ett enkelt program? Var det till
exempel till mer eller mindre hjälp vid design, testning eller kodkvalitetsreflektionerna, eller
valde du bort AI i delar där du använde det förra gången?*

Svar:

Since the scope of the previous laboration was very small AI was only used to create some greeting messages in an array and this was only done to save some time. In this laboration however quality was a bigger concern using AI to proofread documentations and code is a nie helping hand.
