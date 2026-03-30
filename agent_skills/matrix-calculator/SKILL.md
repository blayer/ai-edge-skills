---
name: matrix-calculator
description: Perform matrix operations (add, multiply, transpose, determinant) rendered in webview grid.
---

# Matrix Calculator

Perform matrix operations with visual grid display.

## Examples

* "Multiply 2x2 matrix [[1,2],[3,4]] by [[5,6],[7,8]]"
* "Find the determinant of [[3,1],[5,2]]"

## Instructions

Call the `run_js` tool with the following exact parameters:

- data: A JSON string with the following fields:
  - operation: "add", "multiply", "transpose", "determinant", "inverse", or "scalar_multiply".
  - matrix_a: 2D array representing the first matrix (e.g., [[1,2],[3,4]]).
  - matrix_b: (optional) 2D array for second matrix (for add/multiply).
  - scalar: (optional) Number for scalar multiplication.
