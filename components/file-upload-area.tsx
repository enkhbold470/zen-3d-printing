'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface FileUploadAreaProps {
  onFileUpload: (files: File[]) => void
}

export function FileUploadArea({ onFileUpload }: FileUploadAreaProps) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        onFileUpload(acceptedFiles)
        setTimeout(() => setUploadProgress(0), 500) // Reset progress after a delay
      }
    }, 200)
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag & drop files here, or click to select files
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supported formats: STEP, STL, OBJ, FBX
      </p>
      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="w-full mt-4" />
      )}
    </div>
  )
}

