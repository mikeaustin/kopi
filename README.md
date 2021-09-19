# kopi

### A simple, immutable, 100% asynchronous programming language.

What started out as an excersize turned into a real language. I has a Haskell/ML/Scala style (minimal) syntax, behaves kind of like a LISP, and is interpreted in JavaScript. More details can be found here:

https://docs.google.com/presentation/d/1NtJtgIilqQv2XBoCmybcQU_IsEcylMOcLYXkgB5dQoM/edit?usp=sharing

### There are no keywords

'match' is simply a function, and pattern matching is just a n-tuple of anonymous functions.

    factorial = n => match n (
      0 => 1
      n => n * (factorial n - 1)
    )

    print (factorial 170)

### There is no mutation

Shared mutable data is evil, but some impure functions such as 'print' and 'random' are handy.

    x = 1
    f = () => x

    x = "hi"
    print (f (), x)

    > (1, "hi")

### No more async awaits

'input' simply waits for user input and resolves as an argument to 'match'. 'sleep' does the same.


    match (input "Amount?") (
      "0" => print "> Zero"
       n  => sleep n
    )

    (sleep 1) + (sleep 1)

## Installation and running tests

Install the project

    git clone https://github.com/mikeaustin/kopi.git
    cd kopi/packages/kopi
    > npm install

To start the REPL

    > npm start

To run a specific test

    > npm start test/basics.kopi

Run all tests

    > npm test
