import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB" },
  })
    .middleware(async () => {
      // Get the current user from Clerk
      const { userId } = await auth();

      if (!userId) {
        throw new UploadThingError("Unauthorized");
      }

      // Anything returned here becomes `metadata` in onUploadComplete
      return { userId };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log("Upload complete for userId:", metadata.userId);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
