import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from '../../components/RelatedTools';

import {
FilePlus,
Trash2,
Loader2,
Download,
ChevronDown,
Settings,
Layers,
Eye
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const WatermarkPdf = () => {

const [file,setFile] = useState(null)
const [preview,setPreview] = useState(null)
const [pdfUrl,setPdfUrl] = useState(null)
const [loading,setLoading] = useState(false)

const [showGuide,setShowGuide] = useState(false)

const [mode,setMode] = useState("text")
const [watermarkText,setWatermarkText] = useState("CONFIDENTIAL")
const [imageFile,setImageFile] = useState(null)

const [position,setPosition] = useState("center")
const [mosaic,setMosaic] = useState(false)

const [opacity,setOpacity] = useState(0.3)
const [rotation,setRotation] = useState(0)

const [fromPage,setFromPage] = useState(1)
const [toPage,setToPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

const [layer,setLayer] = useState("over")


/* preview */

const generatePreview = async(file)=>{

const buffer = await file.arrayBuffer()

const pdf = await pdfjsLib.getDocument({data:buffer}).promise

setTotalPages(pdf.numPages)
setToPage(pdf.numPages)

const page = await pdf.getPage(1)

const viewport = page.getViewport({scale:1.5})

const canvas = document.createElement("canvas")

const ctx = canvas.getContext("2d")

canvas.width = viewport.width
canvas.height = viewport.height

await page.render({
canvasContext:ctx,
viewport
}).promise

return canvas.toDataURL()

}



/* upload */

const handleUpload = async(f)=>{

if(!f || f.type !== "application/pdf"){

alert("Upload PDF file")
return

}

setFile(f)

const img = await generatePreview(f)

setPreview(img)

setFromPage(1)

}



/* reset */

const resetAll = ()=>{

setFile(null)
setPreview(null)
setPdfUrl(null)
setImageFile(null)
setTotalPages(1)

}



/* position */

const getPosition = (pageWidth,pageHeight, contentWidth = 100, contentHeight = 40)=>{

let x = (pageWidth - contentWidth) / 2
let y = (pageHeight - contentHeight) / 2

if(position==="top") y = pageHeight - 100
if(position==="bottom") y = 100

if(position==="top-left"){x=50;y=pageHeight-100}
if(position==="top-right"){x=pageWidth-contentWidth-50;y=pageHeight-100}

if(position==="bottom-left"){x=50;y=100}
if(position==="bottom-right"){x=pageWidth-contentWidth-50;y=100}

return {x,y}

}



/* watermark */

const addWatermark = async()=>{

if(!file) return

setLoading(true)

try{

const bytes = await file.arrayBuffer()

const pdfDoc = await PDFDocument.load(bytes)

const pages = pdfDoc.getPages()

const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

let watermarkImg

if(mode==="image" && imageFile){

const imgBytes = await imageFile.arrayBuffer()

if(imageFile.type.includes("png"))
watermarkImg = await pdfDoc.embedPng(imgBytes)
else
watermarkImg = await pdfDoc.embedJpg(imgBytes)

}

pages.forEach((page,index)=>{

const pageNumber = index+1

if(pageNumber < fromPage || pageNumber > toPage) return

const {width,height} = page.getSize()

const contentWidth = mode === "text" ? watermarkText.length * 20 : 200
const contentHeight = mode === "text" ? 40 : 100

const {x,y} = getPosition(width,height, contentWidth, contentHeight)


if(mode==="text" && !mosaic){

page.drawText(watermarkText,{
x,
y,
size:50,
font,
color:rgb(0.5, 0.5, 0.5),
rotate:{type:"degrees",angle:rotation},
opacity,
})

}


if(mode==="image" && watermarkImg && !mosaic){

page.drawImage(watermarkImg,{
x,
y,
width:200,
height:100,
opacity,
})

}


if(mosaic){

for(let i=0;i<width;i+=200){

for(let j=0;j<height;j+=150){

if(mode==="text"){

page.drawText(watermarkText,{
x:i,
y:j,
size:20,
font,
opacity:opacity * 0.5,
rotate:{type:"degrees",angle:rotation}
})

}

if(mode==="image" && watermarkImg){

page.drawImage(watermarkImg,{
x:i,
y:j,
width:80,
height:40,
opacity:opacity * 0.5
})

}

}

}

}

})

const pdfBytes = await pdfDoc.save()

const blob = new Blob([pdfBytes],{type:"application/pdf"})

const url = URL.createObjectURL(blob)

setPdfUrl(url)

}

catch(err){

console.error(err)
alert("Watermark failed")

}

setLoading(false)

}



/* UI */

return(

<div className="min-h-screen bg-[#f8fafc] py-20 px-4 font-sans">

<div className="max-w-6xl mx-auto">

<div className="text-center mb-12">
<h1 className="text-4xl font-black text-slate-800 mb-2">
 <span className="text-red-600">Add Watermark to PDF</span> 
</h1>
<p className="text-slate-500 font-medium">Protect your documents with custom text or image watermarks</p>
</div>



{/* upload */}

{!file &&(

<label className="group border-2 border-dashed border-slate-200 p-20 rounded-[32px] bg-white text-center cursor-pointer block mb-10 hover:border-red-500 hover:bg-red-50/30 transition-all duration-300 shadow-sm">

<div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
<FilePlus className="text-red-500" size={36}/>
</div>

<p className="font-bold text-2xl text-slate-700">
Click or drag PDF here
</p>
<p className="text-slate-400 mt-2">Maximum file size: 50MB</p>

<input
type="file"
hidden
accept="application/pdf"
onChange={(e)=>handleUpload(e.target.files[0])}
/>

</label>

)}



{/* MAIN TOOL */}

{file &&(

<div className="grid lg:grid-cols-5 gap-8">


{/* LEFT PREVIEW */}

<div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-fit">

<div className="flex items-center justify-between mb-6 text-slate-800 font-bold">
<div className="flex items-center gap-2">
<Eye size={20} className="text-red-500"/>
<span>Live Preview</span>
</div>
<span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500">{file.name}</span>
</div>

{preview ? (
<div className="relative border rounded-2xl overflow-hidden bg-slate-100 p-4 flex justify-center">
<img
src={preview}
className="max-w-full h-auto rounded-lg shadow-2xl border border-white"
alt="preview"
/>
</div>
) : (
<div className="h-[500px] bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center">
<Loader2 className="animate-spin text-slate-300"/>
</div>
)}

</div>



{/* RIGHT OPTIONS */}

<div className="lg:col-span-2 space-y-6">

<div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">

<div className="flex items-center gap-2 mb-2 text-slate-800 font-bold border-b pb-4">
<Settings size={20} className="text-red-500"/>
<span>Watermark options</span>
</div>



<div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">

<button
onClick={()=>setMode("text")}
className={`py-2 rounded-lg font-bold text-sm transition-all ${mode==="text"?"bg-white text-red-600 shadow-sm":"text-slate-500"}`}
>
Place text
</button>

<button
onClick={()=>setMode("image")}
className={`py-2 rounded-lg font-bold text-sm transition-all ${mode==="image"?"bg-white text-red-600 shadow-sm":"text-slate-500"}`}
>
Place image
</button>

</div>



{mode==="text" ? (

<div className="space-y-2">
<input
type="text"
value={watermarkText}
onChange={(e)=>setWatermarkText(e.target.value)}
className="border-2 border-slate-100 p-4 rounded-2xl w-full focus:border-red-500 outline-none transition-all font-semibold"
placeholder="Enter watermark text"
/>
</div>

) : (

<div className="space-y-2">
<input
type="file"
accept="image/*"
onChange={(e)=>setImageFile(e.target.files[0])}
className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
/>
</div>

)}



<div className="space-y-2">
<label className="text-xs font-black uppercase text-slate-400 tracking-wider">Position</label>
<div className="grid grid-cols-3 gap-2">
{['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right', 'center'].map((pos) => (
<button
key={pos}
onClick={() => setPosition(pos)}
className={`p-2 border-2 rounded-xl text-xs font-bold capitalize transition-all ${position === pos ? "border-red-500 bg-red-50 text-red-600" : "border-slate-100 text-slate-400"}`}
>
{pos.replace('-', ' ')}
</button>
))}
</div>
</div>



<div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
<div className="flex items-center gap-3">
<Layers size={18} className="text-slate-400"/>
<span className="font-bold text-slate-700">Mosaic</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input type="checkbox" checked={mosaic} onChange={()=>setMosaic(!mosaic)} className="sr-only peer"/>
<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
</label>
</div>



<div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
<label className="text-xs font-black uppercase text-slate-400">Transparency</label>
<select
value={opacity}
onChange={(e)=>setOpacity(parseFloat(e.target.value))}
className="border-2 border-slate-100 p-3 rounded-2xl w-full bg-slate-50 font-bold"
>
<option value="1">No transparency</option>
<option value="0.7">75%</option>
<option value="0.5">50%</option>
<option value="0.3">25%</option>
<option value="0.1">10%</option>
</select>
</div>

<div className="space-y-2">
<label className="text-xs font-black uppercase text-slate-400">Rotation</label>
<select
value={rotation}
onChange={(e)=>setRotation(parseInt(e.target.value))}
className="border-2 border-slate-100 p-3 rounded-2xl w-full bg-slate-50 font-bold"
>
<option value="0">Do not rotate</option>
<option value="45">45°</option>
<option value="90">90°</option>
<option value="-45">-45°</option>
</select>
</div>
</div>



<div className="space-y-2">
<label className="text-xs font-black uppercase text-slate-400">Pages</label>
<div className="flex gap-4 items-center">
<div className="flex-1">
<label className="text-[10px] text-slate-400 block ml-1">From</label>
<input
type="number"
min="1"
max={totalPages}
value={fromPage}
onChange={(e)=>setFromPage(Math.max(1, Number(e.target.value)))}
className="border-2 border-slate-100 w-full p-3 rounded-2xl font-bold"
/>
</div>
<div className="flex-1">
<label className="text-[10px] text-slate-400 block ml-1">To</label>
<input
type="number"
min="1"
max={totalPages}
value={toPage}
onChange={(e)=>setToPage(Math.min(totalPages, Number(e.target.value)))}
className="border-2 border-slate-100 w-full p-3 rounded-2xl font-bold"
/>
</div>
</div>
</div>



<div className="space-y-2">
<label className="text-xs font-black uppercase text-slate-400">Layer</label>
<div className="grid grid-cols-2 gap-4">
<button
onClick={() => setLayer("over")}
className={`p-4 border-2 rounded-2xl text-xs font-bold transition-all ${layer === "over" ? "border-red-500 bg-red-50 text-red-600" : "border-slate-100 text-slate-400"}`}
>
Over PDF content
</button>
<button
onClick={() => setLayer("below")}
className={`p-4 border-2 rounded-2xl text-xs font-bold transition-all ${layer === "below" ? "border-red-500 bg-red-50 text-red-600" : "border-slate-100 text-slate-400"}`}
>
Below PDF content
</button>
</div>
</div>



<div className="flex gap-4 pt-4">

<button
onClick={addWatermark}
disabled={loading}
className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
>
{loading ? <Loader2 className="animate-spin"/> : "Add watermark"}
</button>


<button
onClick={resetAll}
className="px-6 border-2 border-slate-100 hover:bg-slate-50 text-slate-500 font-bold rounded-2xl transition-all"
>
<Trash2 size={20}/>
</button>

</div>

</div>

{pdfUrl &&(
<a
href={pdfUrl}
download="watermarked.pdf"
className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-red-100 mt-6"
>
<Download size={24}/>
DOWNLOAD NOW
</a>
)}

</div>

</div>

)}



{/* guide */}

<div className="mt-20 max-w-3xl mx-auto">
<button
onClick={()=>setShowGuide(!showGuide)}
className="w-full bg-white border border-slate-100 p-6 rounded-2xl flex justify-between items-center shadow-sm group"
>
<span className="font-bold text-slate-700">How to use this tool</span>
<ChevronDown className={`text-slate-400 group-hover:text-red-500 transition-all ${showGuide?"rotate-180":""}`}/>
</button>


{showGuide &&(

<div className="bg-white border border-slate-100 border-t-0 p-8 rounded-b-2xl text-slate-600 space-y-4 animate-in slide-in-from-top-2">
<p>1. Upload your PDF.</p>
<p>2. Choose text or image watermark style.</p>
<p>3. Adjust transparency, rotation, and position settings.</p>
<p>4. Select the page range you want to apply the watermark to.</p>
<p>5. Click "Add watermark" and download your protected file.</p>
</div>

)}
</div>

         <RelatedTools categoryId='pdf' />


</div>
</div>

)

}

export default WatermarkPdf;