# Computer Graphics and Visualization

## What to Expect

This section is about how images actually get put on screen — the pipeline that takes 3D geometry and turns it into pixels, the math behind moving and rotating objects in space, and the rendering techniques (rasterization, ray tracing) that make that fast or realistic. It's one of the more visually rewarding sections in the curriculum: progress here is usually something you can literally see.

Topics covered:

- Graphics pipelines
- Geometric transformations
- 2D and 3D graphics primitives
- Rendering techniques (ray tracing, rasterization)
- Animation and simulation
- Visualization techniques

Expect this to be implementation-heavy once you're past the initial theory — you'll spend real time writing OpenGL code, not just watching explanations of how rendering works.

## What to Prepare

**Prerequisites:** [Programming Fundamentals](/#programming-fundamentals-4-6-weeks), [Mathematics for Computer Science](/#mathematics-for-computer-science-8-12-weeks) — linear algebra especially. Transformations and projections in this section are directly built on matrix and vector math.

A few things worth knowing going in:

- **Set up a graphics-capable development environment before you start** — Learn OpenGL walks you through this, but plan for some initial friction getting drivers, a compiler, and the relevant libraries (GLFW/GLAD or similar) working together.
- **If linear algebra felt abstract in Mathematics for Computer Science, it won't stay that way here.** Seeing a matrix multiplication actually rotate a shape on screen is where a lot of that math clicks for the first time.
- **Real-Time Rendering (the third resource below) is a reference, not a course** — it's there for when you want more depth on a specific technique, not something to read start to finish.

## Resources

- [ ] Mark complete when you've finished this section

| Resource | Format | Est. Time | Role |
|---|---|---|---|
| [Interactive Computer Graphics by University of Tokyo on Coursera](https://www.coursera.org/learn/interactive-computer-graphics) ![Course](https://img.shields.io/badge/-%F0%9F%8E%93-2E86DE) ![Free](https://img.shields.io/badge/-%F0%9F%86%93-2ECC71) | Course | ≈30 hrs (≈3 weeks @ 10 hrs/wk) | **Primary** — structured path through this section |
| [Learn OpenGL](https://learnopengl.com/) ![Book](https://img.shields.io/badge/-%F0%9F%93%96-16A085) ![PDF](https://img.shields.io/badge/-%F0%9F%93%84-616161) ![Free](https://img.shields.io/badge/-%F0%9F%86%93-2ECC71) | Book | ≈13-17 hrs (≈522 pages) | **Companion** — hands-on practical implementation guide (OpenGL specifically) to pair with the course's theory |
| [Learn OpenGL (print edition) by Joey de Vries](https://www.amazon.ca/dp/9090332561?tag=cs-gh-20) ![Book](https://img.shields.io/badge/-%F0%9F%93%96-16A085) ![Paid](https://img.shields.io/badge/-%F0%9F%92%B0-orange) ![Amazon](/assets/badge-amazon.svg) | Book | ≈13-17 hrs | Physical copy of the companion above |
| [Real-Time Rendering by Tomas Akenine-Möller, Eric Haines, and Naty Hoffman](https://www.amazon.ca/Real-Time-Rendering-Fourth-Tomas-Akenine-M%C3%B6ller/dp/1138627003?tag=cs-gh-20) ![Book](https://img.shields.io/badge/-%F0%9F%93%96-16A085) ![Paid](https://img.shields.io/badge/-%F0%9F%92%B0-orange) ![Amazon](/assets/badge-amazon.svg) | Book | Reference — 1,178 pages, not meant to be read linearly | **Companion** — the deep reference text for when you need more rigor than either option above |
