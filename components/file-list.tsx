import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { listFiles, deleteFilesFromSupabase } from "@/lib/supabase/storage";
import { toast } from "sonner";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: "Uploaded" | "In Processing";
}

interface FileListProps {
  files: FileInfo[];
  onRefresh?: () => void;
}

export function FileList({ files: initialFiles, onRefresh }: FileListProps) {
  const [files, setFiles] = useState<FileInfo[]>(initialFiles);
  const { user } = useUser();

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  useEffect(() => {
    async function fetchFiles() {
      if (!user) return;

      try {
        const storageFiles = await listFiles(user.id);
        const newFiles = storageFiles.map((file) => ({
          id: file.id,
          name: file.name.split("/").pop() || file.name, // Remove user ID prefix
          size: file.metadata?.size || 0,
          uploadDate: new Date(file.created_at),
          status: "Uploaded" as const,
        }));
        setFiles((prevFiles) => {
          // Merge with existing files, keeping processing status
          const existingFiles = prevFiles.filter(
            (f) => f.status === "In Processing"
          );
          return [...existingFiles, ...newFiles];
        });
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to load files");
      }
    }

    fetchFiles();
  }, [user]);

  const handleDeleteFile = async (fileId: string) => {
    if (!user) return;
    const fileToDelete = files.find((file) => file.id === fileId);
    if (fileToDelete) {
      const { error } = await deleteFilesFromSupabase(user.id, [
        fileToDelete.name,
      ]);
      if (error) {
        toast.error(`Failed to delete file: ${fileToDelete.name}`);
      } else {
        // Debugging: Log the file deletion process
        console.log(`File deleted from Supabase: ${fileToDelete.name}`);
        setFiles((prevFiles) =>
          prevFiles.filter((f) => f.id !== fileToDelete.id)
        );
        toast.success(`File deleted successfully: ${fileToDelete.name}`);
      }
    } else {
      // Debugging: Log if the file to delete was not found
      console.warn(`File to delete not found: ${fileId}`);
    }
  };

  // useEffect(() => {
  //   const deleteFiles = async () => {
  //     const filesToDelete = files.filter(
  //       (file) => file.status === "In Processing"
  //     );
  //     for (const file of filesToDelete) {
  //       await handleDeleteFile(file.id);
  //     }
  //   };

  //   deleteFiles();
  // }, [files]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{formatDate(file.uploadDate)}</TableCell>
              <TableCell>
                <Badge
                  variant={file.status === "Uploaded" ? "secondary" : "default"}
                >
                  {file.status}
                </Badge>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
