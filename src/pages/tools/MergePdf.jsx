import React, { useState } from "react";
import {
FilePlus,
FileStack,
Trash2,
Loader2,
GripVertical,
X
} from "lucide-react";

import { PDFDocument } from "pdf-lib";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

import {
DndContext,
closestCenter,
PointerSensor,
useSensor,
useSensors
} from "@dnd-kit/core";

import {
arrayMove,
SortableContext,
useSortable,
verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import RelatedTools from '../../components/RelatedTools';


pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;


/////////////////////////////////////////////////////
// Sortable Item
/////////////////////////////////////////////////////

const SortableFile = ({ fileObj, onRemove, onPreview }) => {

const { attributes, listeners, setNodeRef, transform, transition } =
useSortable({ id: fileObj.id });

const style = {
transform: CSS.Transform.toString(transform),
transition
};

return (

<div
ref={setNodeRef}
style={style}
className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm"
>

<div {...attributes} {...listeners} className="cursor-grab text-gray-400">
<GripVertical />
</div>

<img
src={fileObj.preview}
onClick={() => onPreview(fileObj.preview)}
className="w-20 h-28 object-cover rounded cursor-pointer hover:scale-105 transition"
/>

<div className="flex-1">

<p className="font-semibold text-sm truncate">
{fileObj.name}
</p>

<p className="text-xs text-gray-400">
{fileObj.pages} pages • {fileObj.size}
</p>

</div>

<button
onClick={() => onRemove(fileObj.id)}
className="text-red-500 hover:text-red-700"
>
<Trash2 />
</button>

</div>

);

};


/////////////////////////////////////////////////////
// MAIN COMPONENT
/////////////////////////////////////////////////////

const MergePdf = () => {

const [files, setFiles] = useState([]);
const [loading, setLoading] = useState(false);
const [previewImage, setPreviewImage] = useState(null);
const [showGuide, setShowGuide] = useState(false);

const sensors = useSensors(useSensor(PointerSensor));

/////////////////////////////////////////////////////
// Generate Thumbnail
/////////////////////////////////////////////////////

const generatePreview = async (file) => {

const buffer = await file.arrayBuffer();

const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

const page = await pdf.getPage(1);

const viewport = page.getViewport({ scale: 0.6 });

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d");

canvas.width = viewport.width;
canvas.height = viewport.height;

await page.render({
canvasContext: ctx,
viewport
}).promise;

return canvas.toDataURL();

};

/////////////////////////////////////////////////////
// Handle Upload
/////////////////////////////////////////////////////

const handleFiles = async (selectedFiles) => {

const newFiles = await Promise.all(

Array.from(selectedFiles)
.filter((f) => f.type === "application/pdf")

.map(async (file) => {

const preview = await generatePreview(file);

const bytes = await file.arrayBuffer();

const pdf = await PDFDocument.load(bytes);

return {
id: crypto.randomUUID(),
file,
preview,
name: file.name,
pages: pdf.getPageCount(),
size: (file.size / 1024 / 1024).toFixed(2) + " MB"
};

})

);

setFiles((prev) => [...prev, ...newFiles]);

};

/////////////////////////////////////////////////////
// Merge PDFs
/////////////////////////////////////////////////////

const mergePdfs = async () => {

if (files.length < 2) return;

setLoading(true);

try {

const merged = await PDFDocument.create();

for (const f of files) {

const bytes = await f.file.arrayBuffer();

const pdf = await PDFDocument.load(bytes);

const pages = await merged.copyPages(
pdf,
pdf.getPageIndices()
);

pages.forEach((p) => merged.addPage(p));

}

const mergedBytes = await merged.save();

const blob = new Blob([mergedBytes], {
type: "application/pdf"
});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "merged.pdf";

a.click();

URL.revokeObjectURL(url);

} catch {

alert("Merge failed");

}

setLoading(false);

};

/////////////////////////////////////////////////////
// UI
/////////////////////////////////////////////////////

return (
<>
<div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">

<div className="max-w-3xl mx-auto">

<h1 className="text-4xl font-bold text-rose-500 text-center mb-10">
Merge PDF
</h1>

{/* Upload */}

<label className="border-2 border-dashed p-16 rounded-xl bg-white text-center cursor-pointer block mb-10">

<FilePlus
className="mx-auto mb-4 text-red-500"
size={40}
/>

<p className="font-semibold text-lg">
Upload PDF files
</p>

<input
type="file"
hidden
multiple
accept="application/pdf"
onChange={(e) => handleFiles(e.target.files)}
/>

</label>


{/* File List */}

<DndContext
sensors={sensors}
collisionDetection={closestCenter}
onDragEnd={(event) => {

const { active, over } = event;

if (!over || active.id === over.id) return;

setFiles((items) =>
arrayMove(
items,
items.findIndex((i) => i.id === active.id),
items.findIndex((i) => i.id === over.id)
)
);

}}
>

<SortableContext
items={files.map((f) => f.id)}
strategy={verticalListSortingStrategy}
>

<div className="space-y-4">

{files.map((file) => (

<SortableFile
key={file.id}
fileObj={file}
onPreview={(img) => setPreviewImage(img)}
onRemove={(id) =>
setFiles((f) => f.filter((x) => x.id !== id))
}
/>

))}

</div>

</SortableContext>

</DndContext>


{/* Merge Button */}

<button
onClick={mergePdfs}
disabled={files.length < 2 || loading}
className="mt-10 w-full py-4 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
>

{loading ? (
<Loader2 className="animate-spin" />
) : (
<FileStack />
)}

{loading ? "Merging..." : "Merge PDF"}

</button>


{/* How to Use Dropdown */}

<div className="mt-6">

<button
onClick={()=>setShowGuide(!showGuide)}
className="w-full flex items-center justify-between bg-white border p-4 rounded-xl font-semibold"
>

<span>How to use this tool</span>

<span>{showGuide ? "▲" : "▼"}</span>

</button>

{showGuide && (

<div className="bg-white border border-t-0 p-5 text-sm text-gray-600 leading-relaxed">

<p>1. Click <b>Upload PDF files</b> and select multiple PDFs.</p>

<p>2. Drag files using the handle to change order.</p>

<p>3. Click any thumbnail to preview the PDF.</p>

<p>4. Remove unwanted files using the trash icon.</p>

<p>5. Click <b>Merge PDF</b> to download the combined document.</p>

</div>

)}

</div>


</div>


{/* Preview Modal */}

{previewImage && (

<div
className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
onClick={() => setPreviewImage(null)}
>

<button
className="absolute top-6 right-6 text-white"
>
<X size={30} />
</button>

<img
src={previewImage}
onClick={(e)=>e.stopPropagation()}
className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
/>

</div>

)}

</div>


<RelatedTools categoryId='pdf' />
</>
);

};

export default MergePdf;