"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { uploadFileToSupabase } from "@/lib/supabase/storage";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface FileUploadAreaProps {
  onFileUpload: (files: File[], paths: string[]) => void;
}

export function FileUploadArea({ onFileUpload }: FileUploadAreaProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useUser();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) {
        toast.error("Please sign in to upload files");
        return;
      }

      setUploadProgress(10);
      const uploadPromises = acceptedFiles.map((file) =>
        uploadFileToSupabase(file, user.id)
      );

      try {
        const results = await Promise.all(uploadPromises);
        const paths = results.map((r) => r.path).filter(Boolean);
        const errors = results.filter((r) => r.error);

        if (errors.length) {
          toast.error(`Failed to upload ${errors.length} files`);
        }

        if (paths.length) {
          onFileUpload(acceptedFiles, paths);
          toast.success(`Successfully uploaded ${paths.length} files`);
        }
      } catch (error) {
        toast.error("Error uploading files");
        console.error("Upload error:", error);
      } finally {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
      }
    },
    [user, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "model/stl": [".stl"],
      "model/obj": [".obj"],
      "model/step": [".step", ".stp"],
      "model/fbx": [".fbx"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-primary"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag & drop files here, or click to select files
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supported formats: STEP, STL, OBJ, FBX (max 50MB)
      </p>
      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="w-full mt-4" />
      )}
    </div>
  );
}
