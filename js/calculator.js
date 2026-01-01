// Helper functions
function createMatrix(containerId, rows, cols){
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'matrix-table';
    for(let i=0;i<rows;i++){
      const tr = document.createElement('tr');
      for(let j=0;j<cols;j++){
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type='number';
        input.value=0;
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  }
  
  function readMatrix(containerId){
    const table = document.getElementById(containerId).querySelector('table');
    const data=[];
    if(!table) return data;
    for(let tr of table.rows){
      const row=[];
      for(let td of tr.cells){
        row.push(parseFloat(td.querySelector('input').value) || 0);
      }
      data.push(row);
    }
    return data;
  }
  
  function determinant(mat){
    if(mat.length!==mat[0].length) return null;
    if(mat.length===1) return mat[0][0];
    if(mat.length===2) return mat[0][0]*mat[1][1]-mat[0][1]*mat[1][0];
    // فقط 1 و 2 بعدش ساده
    return null;
  }
  
  function inverse2x2(mat){
    if(mat.length!==2 || mat[0].length!==2) return null;
    const det = determinant(mat);
    if(det===0) return null;
    return [
      [mat[1][1]/det, -mat[0][1]/det],
      [-mat[1][0]/det, mat[0][0]/det]
    ];
  }
  
  function transpose(mat){
    const rows=mat.length, cols=mat[0].length;
    const res=[];
    for(let j=0;j<cols;j++){
      const row=[];
      for(let i=0;i<rows;i++) row.push(mat[i][j]);
      res.push(row);
    }
    return res;
  }
  
  function addMatrix(A,B){
    const rows=A.length, cols=A[0].length;
    const res=[];
    for(let i=0;i<rows;i++){
      const row=[];
      for(let j=0;j<cols;j++) row.push(A[i][j]+B[i][j]);
      res.push(row);
    }
    return res;
  }
  
  function subMatrix(A,B){
    const rows=A.length, cols=A[0].length;
    const res=[];
    for(let i=0;i<rows;i++){
      const row=[];
      for(let j=0;j<cols;j++) row.push(A[i][j]-B[i][j]);
      res.push(row);
    }
    return res;
  }
  
  function mulMatrix(A,B){
    const rows=A.length, cols=B[0].length, inner=A[0].length;
    if(inner!==B.length) return null;
    const res=[];
    for(let i=0;i<rows;i++){
      const row=[];
      for(let j=0;j<cols;j++){
        let sum=0;
        for(let k=0;k<inner;k++) sum+=A[i][k]*B[k][j];
        row.push(sum);
      }
      res.push(row);
    }
    return res;
  }
  
  // Parse query string
  const params=new URLSearchParams(window.location.search);
  const op=params.get('op') || 'add';
  document.getElementById('title').innerText=op.charAt(0).toUpperCase()+op.slice(1)+' Matrix';
  
  // Hide matrix B for single-matrix operations
  if(['det','inv','transpose'].includes(op)){
    document.getElementById('matrixBWrap').style.display='none';
  }
  
  // Generate matrices
  document.getElementById('generate').addEventListener('click',()=>{
    const rows=parseInt(document.getElementById('rows').value);
    const cols=parseInt(document.getElementById('cols').value);
    createMatrix('matrixA', rows, cols);
    if(['add','sub','mul'].includes(op)) createMatrix('matrixB', rows, cols);
  });
  
  // Calculate button
  document.getElementById('calc').addEventListener('click',()=>{
    const A=readMatrix('matrixA');
    const B=readMatrix('matrixB');
    let result;
    switch(op){
      case 'add': result=addMatrix(A,B); break;
      case 'sub': result=subMatrix(A,B); break;
      case 'mul': result=mulMatrix(A,B); break;
      case 'det': result=determinant(A); break;
      case 'inv': result=inverse2x2(A); break;
      case 'transpose': result=transpose(A); break;
    }
    const resBox=document.getElementById('result');
    if(result===null){
      resBox.innerText='Check matrix dimensions!';
    }else if(typeof result==='number'){
      resBox.innerText=result;
    }else{
      resBox.innerHTML='<pre>'+result.map(r=>r.join('\t')).join('\n')+'</pre>';
    }
  });
  