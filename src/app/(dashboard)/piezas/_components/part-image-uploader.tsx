"use client";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import { deleteUploadedFile, uploadFile } from "../../_lib/utils";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize);

interface PartImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialUrl?: string;
}

const PartImageUploader = ({
  onUploadComplete,
  initialUrl,
}: PartImageUploaderProps) => {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const loadInitialFile = async () => {
      if (!initialUrl) return;

      try {
        const res = await fetch(initialUrl);
        const blob = await res.blob();
        const name = initialUrl.split("/").pop() ?? "pieza.png";
        const file = new File([blob], name, { type: blob.type });

        setFiles([
          {
            source: initialUrl,
            options: {
              type: "local",
              file,
            },
          },
        ]);
      } catch (err) {
        console.error("Error al cargar imagen inicial:", err);
      }
    };

    loadInitialFile();
  }, [initialUrl]);

  return (
    <FilePond
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={false}
      acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]}
      labelIdle='Arrastra tu imagen o <span class="filepond--label-action">explora</span>'
      maxFileSize="5MB"
      server={{
        process: (_fieldName, fileParam, _metadata, load, error) => {
          let realFile: File | undefined;
          if (fileParam instanceof File) {
            realFile = fileParam;
          } else if (
            typeof fileParam === "object" &&
            "file" in fileParam &&
            (fileParam as any).file instanceof File
          ) {
            realFile = (fileParam as any).file;
          }

          if (!realFile) {
            error("No se encontró un archivo válido");
            return;
          }

          uploadFile(realFile)
            .then((result) => {
              if (result?.url) {
                onUploadComplete(result.url);
                load(result.url);
              } else {
                error("Subida fallida");
              }
            })
            .catch(() => {
              error("Error de red al subir");
            });
        },
        revert: (uniqueFileId, load, error) => {
          deleteUploadedFile(uniqueFileId, load, error);
        },
      }}
    />
  );
};

export default PartImageUploader;
