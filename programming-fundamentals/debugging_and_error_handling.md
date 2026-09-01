# Debugging and Error Handling

## Course Overview:

This course covers how to find and fix bugs in Python programs, and how to handle errors gracefully at runtime. Through a series of lectures and coding exercises, students will learn debugging techniques, how Python's exception system works, and how to write code that fails safely and predictably.

## Course Outline:

- Introduction to Debugging
  - Common types of bugs (syntax, logic, and runtime errors)
  - Reading and interpreting Python tracebacks
  - Debugging strategies: print statements, rubber duck debugging
- Debugging Tools
  - Using a debugger (`pdb` or an IDE's built-in debugger)
  - Setting breakpoints and stepping through code
  - Inspecting variables and the call stack
- Introduction to Exceptions
  - What are exceptions, and how do they differ from syntax errors?
  - Common built-in exception types (`ValueError`, `TypeError`, `KeyError`, etc.)
- Handling Exceptions
  - `try`/`except` blocks
  - Catching multiple exception types
  - The `else` and `finally` clauses
- Raising and Creating Exceptions
  - Raising exceptions with `raise`
  - Creating custom exception classes
  - Best practices for when to raise vs. handle an exception
- Defensive Programming
  - Validating inputs and assumptions
  - Using assertions
  - Logging errors with the `logging` module
- Final Project
  - Putting it all together: a final project that includes deliberate error handling and logging around operations that can realistically fail (e.g. file or user input).

By the end of this course, students will be able to debug Python programs systematically and write code that handles errors gracefully using exceptions, logging, and defensive programming techniques.
