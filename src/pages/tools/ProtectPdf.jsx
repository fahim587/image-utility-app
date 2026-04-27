import React, { useState } from "react";
import { UploadCloud, Lock, Eye, EyeOff, Download, Trash2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from '../../components/RelatedTools';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const ProtectPdf = () => {

const [file,setFile] = useState(null);
const [thumbnail,setThumbnail] = useState(null);
const [password,setPassword] = useState("");
const [confirm,setConfirm] = useState("");
const [showPassword,setShowPassword] = useState(false);
const [showConfirm,setShowConfirm] = useState(false);
const [isGuideOpen, setIsGuideOpen] = useState(false);
const [loading,setLoading] = useState(false);
const [downloadUrl,setDownloadUrl] = useState(null);


// GENERATE PDF THUMBNAIL
const generateThumbnail = async(file)=>{

try{

const reader = new FileReader();

reader.onload = async function(){

const typedArray = new Uint8Array(this.result);

const pdf = await pdfjsLib.getDocument(typedArray).promise;

const page = await pdf.getPage(1);

const viewport = page.getViewport({scale:1.5});

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.height = viewport.height;
canvas.width = viewport.width;

await page.render({
canvasContext:context,
viewport:viewport
}).promise;

setThumbnail(canvas.toDataURL());

};

reader.readAsArrayBuffer(file);

}catch(err){

console.error("Preview error",err);

}

};


// HANDLE FILE UPLOAD
const handleUpload = (e)=>{

const selected = e.target.files[0];

if(!selected) return;

if(selected.type !== "application/pdf"){
alert("Only PDF allowed");
return;
}

setFile(selected);

generateThumbnail(selected);

};


// ENCRYPT PDF
const protectPdf = async()=>{

if(!file) return alert("Upload PDF first");

if(password.length < 4) return alert("Password must be at least 4 characters");

if(password !== confirm) return alert("Passwords do not match");

const formData = new FormData();

formData.append("file",file);
formData.append("password",password);

setLoading(true);

try{

const res = await fetch("import.meta.env.VITE_API_URL/api/protect-pdf",{
method:"POST",
body:formData
});

if (!res.ok) throw new Error("Encryption failed");

const blob = await res.blob();

const url = URL.createObjectURL(blob);

setDownloadUrl(url);

}catch{

alert("Encryption failed");

}

setLoading(false);

};


// RESET
const resetAll = ()=>{

setFile(null);
setThumbnail(null);
setPassword("");
setConfirm("");
setDownloadUrl(null);

};


return(

<div className="max-w-6xl mx-auto pt-32 pb-16 px-4">

{/* SEO Friendly Headers */}
<header className="text-center mb-12">
<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
Protect <span className="text-rose-600">PDF</span> Online
</h1>
<p className="text-lg text-slate-500 max-w-2xl mx-auto">Secure your PDF documents with professional AES encryption. Fast, private, and 100% free.</p>
</header>


<div className="grid md:grid-cols-2 gap-10">

{/* LEFT SIDE - THUMBNAIL */}

<div className="rounded-3xl p-8 flex flex-col items-center justify-center bg-gray-50/50 min-h-[400px] transition-all overflow-hidden relative border-2 border-dashed border-gray-200">

{downloadUrl ? (
<div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
<div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
<CheckCircle2 size={64}/>
</div>
<h3 className="text-2xl font-bold text-slate-800">Ready to Download</h3>
<p className="text-slate-500 mt-2 text-center">Your file is now encrypted and secured with your password.</p>
<button onClick={resetAll} className="mt-6 text-rose-500 font-bold hover:underline">Protect another file</button>
</div>
) : thumbnail ? (

<div className="relative group animate-in zoom-in duration-300">
<img
src={thumbnail}
className="max-h-[420px] rounded-lg shadow-2xl border-[12px] border-white"
alt="Secure Encrypted PDF Preview"
/>
<button 
onClick={resetAll} 
className="absolute -top-4 -right-4 bg-rose-500 text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
>
<Trash2 size={20}/>
</button>
</div>

):(

<label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">

<div className="bg-white p-6 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
<UploadCloud size={48} className="text-gray-300 group-hover:text-rose-500 transition-colors"/>
</div>

<input
type="file"
className="hidden"
accept="application/pdf"
onChange={handleUpload}
/>

<span className="text-xl font-semibold text-gray-700">Choose PDF File</span>
<span className="text-gray-400 mt-2 text-sm italic">Privacy Protected: Files never leave your browser</span>

</label>

)}

</div>


{/* RIGHT SIDE - SETTINGS */}

<div className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

<div className="flex items-center gap-3 text-xl font-bold text-gray-800 border-b pb-4">
<div className="bg-rose-50 p-2 rounded-lg">
<Lock size={24} className="text-rose-600"/>
</div>
Security Settings
</div>


{/* PASSWORD */}

<div className="space-y-4">
<div className="relative">
<label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block ml-1">Encryption Password</label>
<input
type={showPassword ? "text":"password"}
placeholder="Enter password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none font-medium"
/>
<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-4 bottom-4 text-gray-400 hover:text-gray-600 transition-colors"
>
{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
</button>
</div>


{/* CONFIRM PASSWORD */}

<div className="relative">
<label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block ml-1">Confirm Password</label>
<input
type={showConfirm ? "text":"password"}
placeholder="Confirm password"
value={confirm}
onChange={(e)=>setConfirm(e.target.value)}
className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none font-medium"
/>
<button
type="button"
onClick={()=>setShowConfirm(!showConfirm)}
className="absolute right-4 bottom-4 text-gray-400 hover:text-gray-600 transition-colors"
>
{showConfirm ? <EyeOff size={20}/> : <Eye size={20}/>}
</button>
</div>
</div>


{/* BUTTONS */}

<div className="flex flex-col gap-3 pt-4">

<button
onClick={protectPdf}
disabled={loading || downloadUrl}
className="w-full bg-rose-600 text-white py-4 rounded-2xl font-extrabold text-lg hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-lg shadow-rose-100"
>
{loading ? "Encrypting..." : "Protect PDF Document"}
</button>


<button
onClick={resetAll}
className="flex items-center justify-center gap-2 text-gray-400 font-semibold py-2 hover:text-rose-500 transition-colors"
>
<Trash2 size={16}/>
Reset All Fields
</button>

</div>


{/* DOWNLOAD */}

{downloadUrl &&(

<div className="pt-4 animate-in slide-in-from-top-4 duration-500">
<a
href={downloadUrl}
download={`protected_${file?.name || 'document.pdf'}`}
className="flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl w-full font-black shadow-xl hover:bg-green-700 transition-all"
>
<Download size={24}/>
Download Protected PDF
</a>
</div>

)}

</div>

</div>


{/* HOW TO USE - SINGLE DROPDOWN BOX */}

<section className="mt-20 max-w-4xl mx-auto">
<div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
<button 
onClick={() => setIsGuideOpen(!isGuideOpen)}
className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors group"
>
<h2 className="text-2xl font-bold text-gray-800">How to use this tool?</h2>
{isGuideOpen ? <ChevronUp className="text-rose-500"/> : <ChevronDown className="text-gray-400 group-hover:text-rose-500"/>}
</button>

{isGuideOpen && (
<div className="p-8 pt-0 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mt-6">
{[
 {step: "1", text: "Upload your PDF document."},
 {step: "2", text: "Enter a strong password."},
 {step: "3", text: "Click the Protect PDF button."},
 {step: "4", text: "Download the secured file."}
].map((item, idx) => (
 <div key={idx} className="space-y-3">
  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto font-bold">{item.step}</div>
  <p className="text-gray-600 text-sm font-medium leading-relaxed">{item.text}</p>
 </div>
))}
</div>
</div>
)}
</div>
</section>

<div className="mt-20">
<RelatedTools categoryId='pdf' />
</div>
</div>

);

};

export default ProtectPdf;