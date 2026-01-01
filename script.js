const params = new URLSearchParams(window.location.search);
const op = params.get("op");

const title = document.getElementById("title");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const matrixA = document.getElementById("matrixA");
const matrixB = document.getElementById("matrixB");
const matrixBWrapper = document.getElementById("matrixBWrapper");
const result = document.getElementById("result");

const actionBtn = document.getElementById("actionBtn");
document.getElementById("generate").onclick = generate;

const titles = {
  add: "Matrix Addition",
  multiply: "Matrix Multiplication",
  det: "Determinant",
  inverse: "Matrix Inverse"
};

title.textContent = titles[op];

if (op === "det" || op === "inverse") {
  matrixBWrapper.style.display = "none";
}

function generate() {
  createMatrix(matrixA, +rowsInput.value, +colsInput.value);
  if (matrixBWrapper.style.display !== "none") {
    createMatrix(matrixB, +rowsInput.value, +colsInput.value);
  }
  result.innerHTML = "";
}

function createMatrix(container, r, c) {
  container.innerHTML = "";
  const table = document.createElement("table");
  for (let i = 0; i < r; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < c; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.value = 0;
      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
}

function read(container) {
  return [...container.querySelectorAll("tr")].map(tr =>
    [...tr.children].map(td => +td.firstChild.value)
  );
}

actionBtn.onclick = () => {
  const A = read(matrixA);
  if (op === "add") render(calcAdd(A, read(matrixB)));
  if (op === "multiply") render(calcMul(A, read(matrixB)));
  if (op === "det") result.textContent = "det = " + determinant(A);
  if (op === "inverse") result.textContent = "inverse → coming next 😏";
};

function calcAdd(A, B) {
  return A.map((r, i) => r.map((v, j) => v + B[i][j]));
}

function calcMul(A, B) {
  const res = Array.from({ length: A.length }, () =>
    Array(B[0].length).fill(0)
  );
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < B[0].length; j++)
      for (let k = 0; k < B.length; k++)
        res[i][j] += A[i][k] * B[k][j];
  return res;
}

function determinant(m) {
  if (m.length !== m[0].length) return "invalid";
  if (m.length === 2)
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  return "only 2x2 for now";
}

function render(mat) {
  const table = document.createElement("table");
  mat.forEach(r => {
    const tr = document.createElement("tr");
    r.forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      td.style.padding = "6px 10px";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  result.innerHTML = "";
  result.appendChild(table);
}

generate();
