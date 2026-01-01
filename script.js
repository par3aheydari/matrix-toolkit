const op = new URLSearchParams(location.search).get("op");

const title = document.getElementById("title");
const rows = document.getElementById("rows");
const cols = document.getElementById("cols");
const scalar = document.getElementById("scalar");

const Acon = document.getElementById("matrixA");
const Bcon = document.getElementById("matrixB");
const Bwrap = document.getElementById("matrixBWrap");
const result = document.getElementById("result");

const titles = {
  add:"Addition", sub:"Subtraction", mul:"Multiplication",
  det:"Determinant", inverse:"Inverse",
  transpose:"Transpose", rank:"Rank",
  rref:"RREF", scalar:"Scalar Multiplication"
};
title.textContent = titles[op];

if (["det","inverse","transpose","rank","rref","scalar"].includes(op)) {
  Bwrap.style.display = "none";
}
if (op === "scalar") scalar.style.display = "inline";

document.getElementById("generate").onclick = generate;
document.getElementById("calc").onclick = calculate;

function generate() {
  create(Acon, +rows.value, +cols.value);
  if (Bwrap.style.display !== "none")
    create(Bcon, +rows.value, +cols.value);
  result.innerHTML = "";
}

function create(con,r,c) {
  con.innerHTML="";
  const t=document.createElement("table");
  for(let i=0;i<r;i++){
    const tr=document.createElement("tr");
    for(let j=0;j<c;j++){
      const td=document.createElement("td");
      const inp=document.createElement("input");
      inp.type="number"; inp.value=0;
      td.appendChild(inp); tr.appendChild(td);
    }
    t.appendChild(tr);
  }
  con.appendChild(t);
}

function read(con){
  return [...con.querySelectorAll("tr")]
    .map(tr=>[...tr.children].map(td=>+td.firstChild.value));
}

function calculate(){
  const A=read(Acon);
  if(op==="add") show(A.map((r,i)=>r.map((v,j)=>v+read(Bcon)[i][j])));
  if(op==="sub") show(A.map((r,i)=>r.map((v,j)=>v-read(Bcon)[i][j])));
  if(op==="mul") show(mul(A,read(Bcon)));
  if(op==="transpose") show(A[0].map((_,i)=>A.map(r=>r[i])));
  if(op==="scalar") show(A.map(r=>r.map(v=>v*+scalar.value)));
  if(op==="det") result.textContent="det = "+det2(A);
  if(op==="rank") result.textContent="rank ≈ "+rank(A);
  if(op==="rref") show(rref(A));
  if(op==="inverse") result.textContent="inverse → next step 😏";
}

function mul(A,B){
  const r=Array.from({length:A.length},()=>Array(B[0].length).fill(0));
  for(let i=0;i<A.length;i++)
    for(let j=0;j<B[0].length;j++)
      for(let k=0;k<B.length;k++)
        r[i][j]+=A[i][k]*B[k][j];
  return r;
}

function det2(m){
  if(m.length!==2||m[0].length!==2) return "2x2 only";
  return m[0][0]*m[1][1]-m[0][1]*m[1][0];
}

function rank(m){
  return m.filter(r=>r.some(v=>v!==0)).length;
}

function rref(m){
  m=m.map(r=>r.slice());
  let lead=0;
  for(let r=0;r<m.length;r++){
    if(lead>=m[0].length) return m;
    let i=r;
    while(m[i][lead]===0){
      i++; if(i===m.length){i=r;lead++; if(lead===m[0].length) return m;}
    }
    [m[i],m[r]]=[m[r],m[i]];
    let lv=m[r][lead];
    m[r]=m[r].map(v=>v/lv);
    for(let i2=0;i2<m.length;i2++){
      if(i2!==r){
        let lv2=m[i2][lead];
        m[i2]=m[i2].map((v,j)=>v-lv2*m[r][j]);
      }
    }
    lead++;
  }
  return m;
}

function show(mat){
  const t=document.createElement("table");
  mat.forEach(r=>{
    const tr=document.createElement("tr");
    r.forEach(v=>{
      const td=document.createElement("td");
      td.textContent=+v.toFixed(3);
      tr.appendChild(td);
    });
    t.appendChild(tr);
  });
  result.innerHTML="";
  result.appendChild(t);
}

generate();
