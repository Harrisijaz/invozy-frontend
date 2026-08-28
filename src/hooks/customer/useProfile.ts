import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/src/services/customer/profile.service";

export function useProfile() {
  return useQuery({ queryKey: ["customer", "profile"], queryFn: profileService.get });
}

export function useUpdateDisplayName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.updateDisplayName,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "profile"] });
    },
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.uploadPicture,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "profile"] });
    },
  });
}

export function useRemoveProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.removePicture,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customer", "profile"] });
    },
  });
}
