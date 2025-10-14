import { useState } from 'react';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { storage } from '../lib/firebase';

export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Upload a file
  const uploadFile = async (file: File, path: string) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            setError(error.message);
            reject({ success: false, error: error.message });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ success: true, url: downloadURL });
            } catch (error: any) {
              setError(error.message);
              reject({ success: false, error: error.message });
            }
          }
        );
      });
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Upload multiple files
  const uploadFiles = async (files: File[], basePath: string) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      const uploadPromises = files.map((file, index) => {
        const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
        return uploadFile(file, path);
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);

      return {
        success: failed.length === 0,
        successful,
        failed,
        total: files.length
      };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a file
  const deleteFile = async (path: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get file metadata
  const getFileMetadata = async (path: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fileRef = ref(storage, path);
      const metadata = await getMetadata(fileRef);
      
      return { success: true, metadata };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    progress,
    uploadFile,
    uploadFiles,
    deleteFile,
    getFileMetadata
  };
};
