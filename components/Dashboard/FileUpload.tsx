"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, File, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export const FileUpload = ({ 
  onUploadSuccess,
  onUploadStart
}: { 
  onUploadSuccess: () => void,
  onUploadStart?: () => void 
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
      status: 'pending',
      progress: 0
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  const removeFile = (name: string) => {
    setFiles(files.filter(f => f.name !== name));
  };

  const uploadFiles = async () => {
    if (onUploadStart) onUploadStart();
    setIsUploading(true);
    
    for (const file of files) {
      if (file.status === 'success') continue;
      
      const formData = new FormData();
      formData.append("file", file);

      try {
        setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'uploading' } : f));
        
        await api.post("/api/documents/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'success' } : f));
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error: any) {
        setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'error' } : f));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setIsUploading(false);
    onUploadSuccess();
  };

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50 bg-white/5'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Click or drag files to upload</h3>
          <p className="text-muted mt-2 text-sm">Supported: PDF, CSV, TXT, Excel (Max 10MB per file)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="glass rounded-2xl border border-white/5 p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Queue ({files.length} files)</h4>
            <button 
              onClick={() => setFiles([])} 
              className="text-xs text-muted hover:text-red-400 font-bold"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file, idx) => (
              <div key={`${file.name}-${file.size}-${idx}`} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 group">
                <div className="p-2 rounded-lg bg-white/5">
                  <File className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{file.status}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  {file.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  
                  {file.status !== 'uploading' && file.status !== 'success' && (
                    <button onClick={() => removeFile(file.name)}>
                      <X className="w-4 h-4 text-muted hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={uploadFiles}
            disabled={isUploading || files.every(f => f.status === 'success')}
            className="w-full mt-6 py-4 bg-primary hover:bg-accent disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {isUploading ? "Uploading Knowledge..." : "Start Upload"}
          </button>
        </div>
      )}
    </div>
  );
};
