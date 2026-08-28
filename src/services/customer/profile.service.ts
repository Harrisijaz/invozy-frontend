import { customerApi } from "@/src/lib/customer/api";
import type { Profile, ProfilePictureUploadUrl } from "@/src/types/customer";

const allowedContentTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const maxProfilePictureBytes = 2 * 1024 * 1024;

export function validateProfilePicture(file: File) {
  if (!allowedContentTypes.includes(file.type)) {
    return "Use a PNG, JPG, JPEG, or WEBP image.";
  }
  if (file.size > maxProfilePictureBytes) {
    return "Profile picture must be 2MB or smaller.";
  }
  return null;
}

export const profileService = {
  async get() {
    const response = await customerApi.get<Profile>("/profile");
    return response.data;
  },
  async updateDisplayName(displayName: string) {
    const response = await customerApi.put<Profile>("/profile", { displayName });
    return response.data;
  },
  async requestPictureUploadUrl(file: File) {
    const response = await customerApi.post<ProfilePictureUploadUrl>("/profile/picture/upload-url", {
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    });
    return response.data;
  },
  async uploadPicture(file: File) {
    const upload = await this.requestPictureUploadUrl(file);
    const uploadResponse = await fetch(upload.uploadUrl, {
      method: upload.method,
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error("Unable to upload profile picture. Please try again.");
    }
    const response = await customerApi.post<Profile>("/profile/picture/confirm", { objectKey: upload.objectKey });
    return response.data;
  },
  async removePicture() {
    const response = await customerApi.delete<Profile>("/profile/picture");
    return response.data;
  },
};
