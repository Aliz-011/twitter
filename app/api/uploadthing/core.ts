import { validateRequest } from '@/auth';
import { client } from '@/lib/database';
import streamServerClient from '@/lib/stream';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: '4MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvataUrl = metadata.user.avatarUrl;

      if (oldAvataUrl) {
        const key = oldAvataUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace(
        '/f/',
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      await Promise.all([
        client.user.update({
          where: {
            id: metadata.user.id,
          },
          data: {
            avatarUrl: newAvatarUrl,
          },
        }),

        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatarUrl,
          },
        }),
      ]);

      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for user:', metadata.user.username);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.user.username, avatarUrl: newAvatarUrl };
    }),
  attachment: f({
    image: { maxFileSize: '4MB', maxFileCount: 4 },
    video: { maxFileSize: '64MB', maxFileCount: 4 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError('Unauthorized');

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await client.media.create({
        data: {
          url: file.url.replace(
            '/f/',
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
          ),
          type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO',
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
