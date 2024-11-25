import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadFileToSupabase(
  file: File,
  userId: string
): Promise<{ path: string; error: Error | null }> {
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError, data } = await supabase.storage
    .from("model-files")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      path: "",
      error: uploadError,
    };
  }

  if (data) {
    const {
      data: { publicUrl },
    } = supabase.storage.from("model-files").getPublicUrl(fileName);

    return {
      path: publicUrl,
      error: null,
    };
  }

  return {
    path: "",
    error: new Error("Upload failed, no data returned"),
  };
}

export async function listFiles(userId: string) {
  const { data, error } = await supabase.storage
    .from("model-files")
    .list(`${userId}/`);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteFilesFromSupabase(
  userId: string, // Added userId parameter
  paths: string[]
): Promise<{ error: Error | null }> {
  const { error } = await supabase.storage
    .from("model-files")
    .remove(paths.map((path) => `${userId}/${path}`));

  if (error) {
    return { error };
  }

  return { error: null };
}
