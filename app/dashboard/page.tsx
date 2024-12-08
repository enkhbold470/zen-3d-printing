"use client";
import { useState, useCallback } from "react";
import { FileUploadArea } from "@/components/file-upload-area";
import { FileList } from "@/components/file-list";
// import { Button } from "@/components/ui/button";
// import { PlusCircle } from "lucide-react";
import HeaderDashboard from "@/components/HeaderDashboard";
import { useUser } from "@clerk/nextjs";
import CostCalculator from "@/components/cost-calculator";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: "Uploaded" | "In Processing";
  path: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const { user } = useUser();

  const handleFileUpload = useCallback(
    (uploadedFiles: File[], paths: string[]) => {
      const newFiles: FileInfo[] = uploadedFiles.map((file, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
        status: "Uploaded",
        path: paths[index],
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Update state with new files

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
    },
    []
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-center text-2xl">
        Please sign in to access the dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <HeaderDashboard />
      <h1 className="text-3xl font-bold">Dashboard (Beta)</h1>
      <FileUploadArea onFileUpload={handleFileUpload} />
      <div className="space-y-6">
        <FileList files={files} />
        <CostCalculator />
      </div>
    </div>
  );
}
