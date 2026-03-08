import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/imageProcessor";
import { Download, RotateCw, FlipHorizontal, FlipVertical, Image as ImageIcon, Maximize, FileDigit, Eraser } from "lucide-react";
import { saveAs } from "file-saver";
import { removeBackground } from "@imgly/background-removal";

const ImageEditor = ({ file }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

    // Crop & Transform State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });
    const [aspect, setAspect] = useState(undefined); // undefined = free
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Output State
    const [outputFormat, setOutputFormat] = useState("image/png"); // Default to PNG for transparency
    const [quality, setQuality] = useState(0.9);
    const [resizeDim, setResizeDim] = useState({ width: "", height: "" });
    const [maintainAspect, setMaintainAspect] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isRemovingBg, setIsRemovingBg] = useState(false);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result);
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    setOriginalDimensions({ width: img.width, height: img.height });
                    setResizeDim({ width: img.width, height: img.height });
                };
            });
            reader.readAsDataURL(file);
        }
    }, [file]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleResizeChange = (e) => {
        const { name, value } = e.target;
        if (!maintainAspect) {
            setResizeDim((prev) => ({ ...prev, [name]: value }));
            return;
        }

        const aspectRatio = originalDimensions.width / originalDimensions.height;

        if (name === "width") {
            setResizeDim({ width: value, height: Math.round(value / aspectRatio) });
        } else {
            setResizeDim({ width: Math.round(value * aspectRatio), height: value });
        }
    };

    const handleRemoveBackground = async () => {
        if (!imageSrc) return;
        setIsRemovingBg(true);
        try {
            // imgly operates on the blob/url directly
            const imageBlob = await fetch(imageSrc).then((r) => r.blob());
            const blob = await removeBackground(imageBlob, {
                progress: (key, current, total) => {
                    console.log(`Downloading ${key}: ${Math.round((current / total) * 100)}%`);
                },
            });
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
            setOutputFormat("image/png"); // Force PNG for transparency support
        } catch (error) {
            console.error("Background removal failed:", error);
            alert("Failed to remove background. Please try again.");
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleDownload = async () => {
        setIsProcessing(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flip, outputFormat, quality, resizeDim);
            saveAs(croppedImageBlob, `edited-image.${outputFormat.split("/")[1]}`);
        } catch (e) {
            console.error(e);
            alert("Failed to process image");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!imageSrc) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col lg:flex-row h-[85vh]">
            {/* Editor Area */}
            <div className="relative flex-1 bg-gray-900 h-full min-h-[400px] flex items-center justify-center">
                {/* Checkered background for transparency visibility */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    }}
                />

                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    restrictPosition={false}
                    style={{ containerStyle: { background: "transparent" } }} // Ensure transparency shows through
                    transform={[`translate(${crop.x}px, ${crop.y}px)`, `rotateZ(${rotation}deg)`, `rotateY(${flip.horizontal ? 180 : 0}deg)`, `rotateX(${flip.vertical ? 180 : 0}deg)`, `scale(${zoom})`].join(" ")}
                />

                {/* Floating Zoom Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm px-6 py-2 rounded-full flex gap-4 text-white shadow-xl z-10">
                    <button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="hover:text-blue-400 font-bold">
                        -
                    </button>
                    <span className="text-xs self-center font-mono w-16 text-center">{(zoom * 100).toFixed(0)}%</span>
                    <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="hover:text-blue-400 font-bold">
                        +
                    </button>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 bg-white border-l border-gray-200 flex flex-col h-full">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        Editor
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
                    {/* AI Tools Section */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Eraser className="w-3 h-3" /> AI Tools
                        </h3>
                        <button
                            onClick={handleRemoveBackground}
                            disabled={isRemovingBg}
                            className="w-full btn-tool flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100 text-purple-700 hover:from-purple-100 hover:to-indigo-100 transition-all disabled:opacity-50"
                        >
                            {isRemovingBg ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700"></span>
                                    <span>Removing BG...</span>
                                </>
                            ) : (
                                <>
                                    <Eraser size={16} />
                                    <span>Remove Background</span>
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">Processed locally via WebAssembly</p>
                    </section>

                    {/* Transform Section */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <RotateCw className="w-3 h-3" /> Transform
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setRotation((r) => r + 90)} className="btn-tool" title="Rotate 90°">
                                <RotateCw size={18} />
                            </button>
                            <button onClick={() => setFlip((f) => ({ ...f, horizontal: !f.horizontal }))} className={`btn-tool ${flip.horizontal ? "active" : ""}`} title="Flip Horizontal">
                                <FlipHorizontal size={18} />
                            </button>
                            <button onClick={() => setFlip((f) => ({ ...f, vertical: !f.vertical }))} className={`btn-tool ${flip.vertical ? "active" : ""}`} title="Flip Vertical">
                                <FlipVertical size={18} />
                            </button>
                        </div>
                    </section>

                    {/* Crop Section */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Maximize className="w-3 h-3" /> Crop
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { label: "Free", val: undefined },
                                { label: "1:1", val: 1 },
                                { label: "4:3", val: 4 / 3 },
                                { label: "16:9", val: 16 / 9 },
                            ].map((opt) => (
                                <button key={opt.label} onClick={() => setAspect(opt.val)} className={`text-xs py-2 rounded border transition-colors ${aspect === opt.val ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Resize Section */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileDigit className="w-3 h-3" /> Resize (px)
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="relative w-full">
                                <input type="number" name="width" value={resizeDim.width} onChange={handleResizeChange} className="w-full p-2 pl-8 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none" placeholder="Width" />
                                <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs font-bold">W</span>
                            </div>
                            <div className="relative w-full">
                                <input type="number" name="height" value={resizeDim.height} onChange={handleResizeChange} className="w-full p-2 pl-8 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none" placeholder="Height" />
                                <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs font-bold">H</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="aspect" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="aspect" className="text-xs text-gray-600 select-none cursor-pointer">
                                Maintain Aspect Ratio
                            </label>
                        </div>
                    </section>

                    {/* Export Section */}
                    <section className="bg-gray-50 -mx-5 -mb-5 p-5 border-t border-gray-200 mt-auto">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Format</span>
                                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="bg-white border border-gray-200 text-sm rounded p-1 focus:outline-none focus:border-blue-500">
                                    <option value="image/jpeg">JPEG</option>
                                    <option value="image/png">PNG</option>
                                    <option value="image/webp">WEBP</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Quality</span>
                                    <span>{Math.round(quality * 100)}%</span>
                                </div>
                                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={isProcessing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <Download size={18} />}
                                {isProcessing ? "Processing..." : "Download Image"}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
