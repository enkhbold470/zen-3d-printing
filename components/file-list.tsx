import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatFileSize, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface FileInfo {
  id: string
  name: string
  size: number
  uploadDate: Date
  status: 'Uploaded' | 'In Processing'
}

interface FileListProps {
  files: FileInfo[]
}

export function FileList({ files }: FileListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{formatDate(file.uploadDate)}</TableCell>
              <TableCell>
                <Badge variant={file.status === 'Uploaded' ? 'secondary' : 'default'}>
                  {file.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

