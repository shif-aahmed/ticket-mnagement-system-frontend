'use client';

import React, { useRef } from 'react';
import { AttachmentFile } from '@/types/ticket';
import { UploadCloudIcon, FileTextIcon, TrashIcon } from '@/components/ui/icons';
import { IconButton } from '@/components/ui/icon-button';

export interface AttachmentUploaderProps {
  attachments: AttachmentFile[];
  onAddAttachments: (newFiles: AttachmentFile[]) => void;
  onRemoveAttachment: (id: string) => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const AttachmentUploader = ({
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  className = '',
}: AttachmentUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newAttachments: AttachmentFile[] = filesArray.map((file, idx) => ({
      id: `${Date.now()}_${idx}_${file.name}`,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
    }));

    onAddAttachments(newAttachments);

    // Reset input value so same files can be re-added if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const filesArray = Array.from(e.dataTransfer.files);
    const newAttachments: AttachmentFile[] = filesArray.map((file, idx) => ({
      id: `${Date.now()}_${idx}_${file.name}`,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
    }));

    onAddAttachments(newAttachments);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="ticket-file-attachment-input"
        aria-label="Upload file attachments"
      />

      {/* Dropzone Trigger */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#E5EDE9] hover:border-[#063F3F]/40 bg-[#F3F9F7]/50 hover:bg-[#F3F9F7] rounded-xl p-6 text-center cursor-pointer transition-colors space-y-2 select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Click or drag files here to attach"
      >
        <div className="h-10 w-10 mx-auto rounded-full bg-white border border-[#E5EDE9] flex items-center justify-center text-[#063F3F] shadow-xs">
          <UploadCloudIcon size={20} />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[#102A2A]">
            <span className="text-[#063F3F] underline">Click to upload</span> or drag and drop files
          </p>
          <p className="text-[11px] text-[#6B7F7F]">
            Supports images, PDFs, logs, or diagnostic files (up to 25MB each)
          </p>
        </div>
      </div>

      {/* Selected Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#6B7F7F]">
            Attached files ({attachments.length})
          </span>
          <div className="divide-y divide-[#E5EDE9] border border-[#E5EDE9] rounded-lg bg-white overflow-hidden">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 px-3 hover:bg-[#F3F9F7]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-md bg-[#F3F9F7] border border-[#E5EDE9] flex items-center justify-center text-[#063F3F] shrink-0">
                    <FileTextIcon size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-[#102A2A] truncate max-w-[200px] sm:max-w-[320px]">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-[#6B7F7F]">
                      {file.formattedSize}
                    </span>
                  </div>
                </div>

                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove file ${file.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAttachment(file.id);
                  }}
                  className="text-[#6B7F7F] hover:text-[#EF4444] h-7 w-7"
                >
                  <TrashIcon size={14} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
