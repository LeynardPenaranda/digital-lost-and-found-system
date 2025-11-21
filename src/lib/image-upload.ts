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

// Upload image to Firebase and return the url lost-items-images/
export const UploadLostItemImage = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);

    // Create folder lost-items-images/
    const storageRef = ref(storage, "lost-items-images/" + file.name);

    const uploadedImageResponse = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadedImageResponse.ref);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UploadMultipleLostItemImagesAndreturnURL = async (
  files: File[]
) => {
  try {
    const promises = files.map((file) => UploadLostItemImage(file));

    const arrayUrls = await Promise.all(promises);

    return arrayUrls; // array of image URLs stored in /lost-items-images/
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Upload image to Firebase and return the url found-items-images/
export const UploadFoundItemImage = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);

    // Create folder lost-items-images/
    const storageRef = ref(storage, "found-items-images/" + file.name);

    const uploadedImageResponse = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadedImageResponse.ref);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UploadMultipleFoundItemImagesAndreturnURL = async (
  files: File[]
) => {
  try {
    const promises = files.map((file) => UploadFoundItemImage(file));

    const arrayUrls = await Promise.all(promises);

    return arrayUrls; // array of image URLs stored in /lost-items-images/
  } catch (error: any) {
    throw new Error(error.message);
  }
};
