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

## 2. Funktioner

<!--
    Välj dina fem längsta metoder/funktioner. Ange de viktigaste reglerna från kapitel 3
    (2:a upplagan: kapitel 7–11) som följs eller bryts, och föreslå förändringar.
-->

| Metodnamn | Länk eller kod | Antal rader (ej ws) | Reflektion (regler som följs/bryts, föreslagna förändringar) |
| --------- | --------------- | -------------------- | ------------------------------------------------------------ |
|           |                 |                       |                                                              |
|           |                 |                       |                                                              |
|           |                 |                       |                                                              |
|           |                 |                       |                                                              |
|           |                 |                       |                                                              |

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

*Använde du AI-assistenter annorlunda i den här laborationen jämfört med laboration 1 — nu när
uppgiften är en större, mer kvalitetskänslig modul snarare än ett enkelt program? Var det till
exempel till mer eller mindre hjälp vid design, testning eller kodkvalitetsreflektionerna, eller
valde du bort AI i delar där du använde det förra gången?*

Svar:
