import React, { useState, useRef } from "react";
import productsList from "./products";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

function App() {

const initial = productsList.map(name => ({
name,
given:"",
sold:"",
returned:""
}));

const [products,setProducts] = useState(initial);
const [newProduct,setNewProduct] = useState("");

const tableRef = useRef();

const handleChange = (index,field,value) => {

const updated = [...products];
updated[index][field] = value;

const g = Number(updated[index].given);
const s = Number(updated[index].sold);
const r = Number(updated[index].returned);

if(field==="sold" && g)
updated[index].returned = s-g;

if(field==="returned" && g)
updated[index].sold = g+r;

setProducts(updated);
};

const addProduct = () => {

if(!newProduct) return;

setProducts([
...products,
{
name:newProduct,
given:"",
sold:"",
returned:""
}
]);

setNewProduct("");
};

const getTotal = (field) => {
return products.reduce((sum,p)=>sum+Number(p[field]||0),0);
};

const exportPDF = async () => {

const canvas = await html2canvas(tableRef.current);

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p","mm","a4");

pdf.setFontSize(18);
pdf.text("Kanmani Organics Report",20,15);

pdf.addImage(imgData,"PNG",10,25,190,0);

pdf.save("Kanmani_Report.pdf");

};

return (

<div className="container">

<h1>Kanmani Organics Calculator</h1>

<div className="addProduct">

<input
placeholder="New Product"
value={newProduct}
onChange={(e)=>setNewProduct(e.target.value)}
/>

<button onClick={addProduct}>➕</button>

</div>

<div ref={tableRef}>

<table>

<thead>

<tr>
<th>Product</th>
<th>Given</th>
<th>Sold</th>
<th>Return</th>
</tr>

</thead>

<tbody>

{products.map((p,index)=>(
<tr key={index}>

<td>{p.name}</td>

<td>
<input
value={p.given}
onChange={(e)=>handleChange(index,"given",e.target.value)}
/>
</td>

<td>
<input
value={p.sold}
onChange={(e)=>handleChange(index,"sold",e.target.value)}
/>
</td>

<td>
<input
value={p.returned}
onChange={(e)=>handleChange(index,"returned",e.target.value)}
/>
</td>

</tr>
))}

</tbody>

<tfoot>

<tr>
<th>Total</th>
<th>{getTotal("given")}</th>
<th>{getTotal("sold")}</th>
<th>{getTotal("returned")}</th>
</tr>

</tfoot>

</table>

</div>

<button className="pdfBtn" onClick={exportPDF}>
Download PDF
</button>

</div>

);

}

export default App;