"use client";
import { useRef, useState, useEffect } from "react";
import { Navbar } from "../_components/navbar";
import { Button } from "@/components/ui/button";

interface Prediction {
  [key: string]: number;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isDragActive, setIsDragActive] = useState(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
    setPredictions(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BRAIN_TUMOR_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setPredictions(result);
      } else {
        console.error("Failed to get predictions");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setPredictions(null);
    }
  };

  return (
    <div className="flex h-screen ">
      <Navbar />
      <div className="flex flex-col items-center w-full p-4">
        <div className="w-full p-4 mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
            Brain Tumor Detection
          </h1>
          <p className="text-center text-lg text-gray-600 mb-10">
            Upload an MRI Image to detect whether a brain tumor is present or not.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Upload MRI Scan
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 text-gray-600 transition-colors cursor-pointer ${
                    isDragActive
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 hover:border-blue-500 hover:text-blue-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a1 1 0 001 1h3m10-2v-1a1 1 0 00-1-1h-3M12 12V3m0 9l-3-3m3 3l3-3M4 20h16"
                    />
                  </svg>
                  <p className="text-sm">
                    Drag &amp; drop files here, or <span className="font-semibold">click to select files</span>
                  </p>
                </div>

                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={onSelectFile}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-full object-cover rounded-md border"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedFile || isLoading}
                  variant="default"
                  size="lg"
                >
                  {isLoading ? "Processing..." : "Analyze Image"}
                </Button>
              </form>
            </div>

            {predictions && (
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Results
                </h2>
                <div className="space-y-4">
                  {Object.entries(predictions)
                    .sort(([, a], [, b]) => b - a)
                    .map(([className, probability]) => (
                      <div key={className} className="flex flex-col">
                        <div className="font-medium text-gray-800 mb-1">
                          {className.charAt(0).toUpperCase() + className.slice(1)}
                        </div>
                        <div className="relative bg-gray-200 rounded h-6">
                          <div
                            className="bg-green-500 h-6 rounded"
                            style={{ width: `${probability * 100}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-sm text-white">
                            {(probability * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
