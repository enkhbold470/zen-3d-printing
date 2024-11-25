"use client";

import { useState, useCallback } from "react";
import { FileUploadArea } from "@/components/file-upload-area";
import { FileList } from "@/components/file-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: "Uploaded" | "In Processing";
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileInfo[]>([]);

  const handleFileUpload = useCallback((uploadedFiles: File[]) => {
    const newFiles: FileInfo[] = uploadedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
      status: "Uploaded",
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Simulate processing after upload
    newFiles.forEach((file) => {
      setTimeout(() => {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id ? { ...f, status: "In Processing" } : f
          )
        );
      }, 2000);
    });
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <FileUploadArea onFileUpload={handleFileUpload} />
      <div className="text-center">
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Browse Files
        </Button>
      </div>
      <FileList files={files} />
    </div>
  );
}
