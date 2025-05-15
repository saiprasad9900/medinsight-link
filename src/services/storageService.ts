
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures that the required storage bucket exists
 */
export const ensureStorageBucket = async (): Promise<void> => {
  try {
    // Check if the medical_records bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    // Check if the medical_records bucket already exists
    const bucketExists = buckets?.some(bucket => bucket.name === 'medical_records');
    
    if (!bucketExists) {
      // Create the medical_records bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('medical_records', {
          public: false,
          fileSizeLimit: 10485760, // 10MB file size limit
        });
        
      if (createError) {
        throw createError;
      }
      
      console.log('Created medical_records storage bucket');
    } else {
      console.log('Medical records storage bucket already exists');
    }
  } catch (error) {
    console.error('Error ensuring storage bucket exists:', error);
  }
};

/**
 * Gets a temporary public URL for a file in storage
 */
export const getFilePublicUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('medical_records')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
    
    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting public URL:', error);
    return null;
  }
};

/**
 * List all files in the medical records bucket for a user
 */
export const listUserMedicalRecords = async (userId: string | undefined) => {
  if (!userId) return { data: null, error: new Error('User ID is required') };
  
  try {
    // First ensure the bucket exists
    await ensureStorageBucket();
    
    // Then list files for the user
    return await supabase.storage
      .from('medical_records')
      .list(userId);
  } catch (error) {
    console.error('Error listing user files:', error);
    return { data: null, error };
  }
};
