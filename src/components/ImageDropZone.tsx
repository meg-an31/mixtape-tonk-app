import React, { useState, useRef } from 'react';
import { Upload, Image } from 'lucide-react';

/**
 * Props for the ImageDropZone component
 */
export interface ImageDropZoneProps {
  /** Callback function triggered when an image is selected or dropped */
  onImageSelected: (image: File) => Promise<void>;
  /** Optional className for styling */
  className?: string;
}

/**
 * A drag and drop zone component for image uploads
 * 
 * @description
 * ImageDropZone allows users to either drag and drop image files or click to open
 * a file browser. It accepts common image formats (JPG, PNG, GIF, WebP) and provides
 * visual feedback during drag operations.
 * 
 * @example
 * <ImageDropZone
 *   onImageSelected={(image) => console.log('Image selected:', image.name)}
 *   className="mb-4"
 * />
 */
const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onImageSelected,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accepted image file types
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  /**
   * Validates if the file is an accepted image type
   */
  const isValidImageFile = (file: File): boolean => {
    return acceptedTypes.includes(file.type);
  };

  /**
   * Handles file selection from the file input
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidImageFile(file)) {
        try {
          await onImageSelected(file);
        } catch (error) {
          console.log(error);
        }
      }
      else {
        alert("Sorry, right now we only allow images in your mix-tape.");
      }
    }
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handles drag over events
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave events
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handles file drop events
   */
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidImageFile(file)) {
        try {
          await onImageSelected(file);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  /**
   * Opens the file browser when the drop zone is clicked
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Select image file"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-3 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {isDragOver ? (
              <Upload className="w-8 h-8 text-blue-500" />
            ) : (
              <Image className="w-8 h-8 text-gray-500" />
            )}
          </div>
          
          <div>
            <p className={`text-lg font-medium ${isDragOver ? 'text-blue-700' : 'text-gray-700'}`}>
              {isDragOver ? 'Drop your image here' : 'Drag & drop an image'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or <span className="text-blue-600 hover:text-blue-700 font-medium">click to browse</span>
            </p>
          </div>
          
          <div className="text-xs text-gray-400">
            Supports JPG, PNG, GIF, WebP
          </div>
        </div>
        
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default ImageDropZone;