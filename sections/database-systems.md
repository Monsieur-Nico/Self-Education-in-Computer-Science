# Database Systems

## What to Expect

Almost every real program you write from here on will need to store and retrieve data reliably, and that's what this section is about. You'll learn how relational databases model data, how to design a schema that doesn't fall apart as it grows (normalization), and how to actually get data in and out efficiently with SQL.

Topics covered:

- Introduction to databases
- Relational database systems (SQL)
- Database design and normalization
- Querying and manipulating data
- Database administration

SQL itself is a small, learnable language — most of the real difficulty in this section is in the *design* thinking (how do you structure data so queries stay fast and data stays consistent), not the syntax.

## What to Prepare

**Prerequisites:** [Programming Fundamentals](/#programming-fundamentals-4-6-weeks) — no prior database experience needed.

A few things worth knowing going in:

- **You don't need to install a full database server to start.** CS50's course and SQLBolt both let you practice directly in the browser — a good way to build comfort before setting up something like PostgreSQL or MySQL locally.
- **SQL feels different from the procedural code you've been writing.** You're describing *what* result you want, not *how* to compute it step by step — expect a bit of a mental gear-shift the first time you write a query with a join.
- **Normalization (the database-design part) is where people usually spend more thinking time than expected.** It's less about memorizing rules and more about practicing on real examples until the tradeoffs click.

## Resources

- [ ] Mark complete when you've finished this section

| Resource | Format | Est. Time | Role |
|---|---|---|---|
| [Introduction to Databases with SQL by Harvard University (CS50) on edX](https://www.edx.org/learn/sql/harvard-university-cs50-s-introduction-to-databases-with-sql) ![Course](https://img.shields.io/badge/-%F0%9F%8E%93-2E86DE) ![Free](https://img.shields.io/badge/-%F0%9F%86%93-2ECC71) | Course | ≈7 weeks (6-12 hrs/wk) | **Primary** — structured path through this section |
| [SQLBolt](https://sqlbolt.com/) ![Tutorial](https://img.shields.io/badge/-%F0%9F%A7%AD-8E44AD) ![Free](https://img.shields.io/badge/-%F0%9F%86%93-2ECC71) | Tutorial | ≈2-4 hrs (rough estimate; not officially stated) | **Companion** — quick interactive drills to practice SQL syntax alongside or after the course |
