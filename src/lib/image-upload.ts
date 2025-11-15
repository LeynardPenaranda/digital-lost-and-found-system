import firebaseApp from "@/config/firebase-config";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";

// Upload image to Firebase and return the url
export const UploadImageToFireBaseAndReturnUrl = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, "profile-images" + "/" + file.name);
    const uploadedImageResponse = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadedImageResponse.ref);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Upload image to Firebase and return the url
export const UploadImageToFireBaseAndReturnUrlMessage = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, "chat-images" + "/" + file.name);
    const uploadedImageResponse = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadedImageResponse.ref);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
