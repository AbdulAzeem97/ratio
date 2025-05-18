import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import { FileUp, AlertTriangle, Check } from 'lucide-react';

interface FileUploadProps {
  onUpload: (data: Array<{ COLOR: string; SIZE: string; QTY: number }>, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setIsUploading(true);
    setFileError(null);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false);

        // Check if the required columns exist
        const headers = results.meta.fields || [];
        const requiredColumns = ['COLOR', 'SIZE', 'QTY'];

        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          const errorMsg = `Missing required columns: ${missingColumns.join(', ')}`;
          setFileError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        // Validate that QTY is a number for all rows
        const invalidRows = results.data.filter(
          (row: any) => typeof row.QTY !== 'number' || isNaN(row.QTY) || row.QTY <= 0
        );

        if (invalidRows.length > 0) {
          const errorMsg = `${invalidRows.length} row(s) have invalid QTY values. QTY must be a positive number.`;
          setFileError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        toast.success(`Successfully parsed ${results.data.length} items from ${file.name}`);
        onUpload(results.data as Array<{ COLOR: string; SIZE: string; QTY: number }>, file.name);
      },
      error: (error) => {
        setIsUploading(false);
        setFileError(error.message);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  }, [onUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    processFile(file);
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  // Function to generate the sample CSV data and trigger the download
  const downloadSampleCSV = () => {
    const sampleData = [
      { COLOR: 'Red', SIZE: 'M', QTY: 10 },
      { COLOR: 'Blue', SIZE: 'L', QTY: 15 },
      { COLOR: 'Green', SIZE: 'S', QTY: 5 },
    ];

    const csv = Papa.unparse(sampleData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_inventory.csv';
    link.click();
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Upload Inventory CSV</h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
        } ${fileError ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : ''}`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Uploading file...</p>
          </div>
        ) : fileError ? (
          <div className="flex flex-col items-center justify-center py-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Drop a new CSV file to try again
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3">
            <FileUp className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file or click to browse'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              CSV must have COLOR, SIZE, and QTY columns
            </p>
          </div>
        )}
      </div>

      {/* Sample CSV Download Button */}
      <div className="mt-4">
        <button
          onClick={downloadSampleCSV}
          className="inline-flex items-center  px-20 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Download Sample CSV
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
