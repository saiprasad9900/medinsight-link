
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
    
    // Set up bucket policies if needed
    // This would typically be done through the Supabase dashboard for production apps
    
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
