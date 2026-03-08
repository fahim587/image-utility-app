import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

const DropZone = ({ onUpload }) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onUpload(acceptedFiles[0]);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
        },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer select-none
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
        >
            <input {...getInputProps()} />
            <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-700">{isDragActive ? "Drop image here..." : "Drag & drop your image here"}</p>
            <p className="mt-2 text-sm text-gray-500">or click to select file</p>
            <div className="mt-4 flex justify-center gap-2 text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
                <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
                <span className="bg-gray-100 px-2 py-1 rounded">WEBP</span>
                <span className="bg-gray-100 px-2 py-1 rounded">GIF</span>
            </div>
        </div>
    );
};

export default DropZone;
