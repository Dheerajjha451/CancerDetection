"use client";

import { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";
import Image from "next/image";

const Upload: React.FC = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initModel = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_TEACHABLE_MACHINE_URL_SKIN;
      if (!baseURL) throw new Error("Model URL not defined in environment variables.");
      
      const modelURL = `${baseURL}model.json`;
      const metadataURL = `${baseURL}metadata.json`;
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageURL(result);
        predict(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const predict = async (imageSrc: string) => {
    if (model) {
      const image = new window.Image();
      image.src = imageSrc;
      image.onload = async () => {
        try {
          const predictions = await model.predict(image);
          setPredictions(predictions);
        } catch (error) {
          console.error("Error making prediction:", error);
        }
      };
    }
  };

  useEffect(() => {
    initModel();
  }, []);

  return (

      <div className="flex flex-col items-center w-full p-4">
        <div className="w-full max-w-lg p-4 bg-white shadow-lg rounded-lg mb-6 border-t text-center">
          <label htmlFor="upload-button" className="cursor-pointer">
            <div className="flex items-center justify-center bg-white text-blue-500 border border-blue-500 rounded-lg shadow-md px-4 py-2">
              Upload Image
            </div>
            <input
              id="upload-button"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
          </label>
        </div>
        {imageURL && (
          <div className="flex flex-col items-center">
            <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-xs mb-6">
              <Image
                src={imageURL}
                alt="Uploaded"
                width={300}
                height={300}
                className="object-cover"
              />
            </div>
            <div className="w-full max-w-xs bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-medium mb-4 text-center">Predictions</h2>
              <div id="label-container">
                {predictions.map((prediction, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{prediction.className}</span>
                    <span className="font-semibold">{(prediction.probability * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Upload;
