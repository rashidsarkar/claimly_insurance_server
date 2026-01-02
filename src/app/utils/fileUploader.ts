/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = '';

      if (file.fieldname === 'profile_image') {
        uploadPath = 'uploads/images/profile';
      } else if (file.fieldname === 'supporting_Documents') {
        uploadPath = 'uploads/images/supporting_Documents';
      } else if (file.fieldname === 'medical_mySelf_image') {
        uploadPath = 'uploads/images/medical_mySelf_image';
      } else if (file.fieldname === 'medical_family_image') {
        uploadPath = 'uploads/images/medical_family_image';
      } else if (file.fieldname === 'insurance_Photo') {
        uploadPath = 'uploads/images/insurance_Photo';
      } else if (file.fieldname === 'article_image') {
        uploadPath = 'uploads/images/article_image';
      } else if (file.fieldname === 'video') {
        uploadPath = 'uploads/video';
      } else if (file.fieldname === 'category_image') {
        uploadPath = 'uploads/images/category_images';
      } else {
        uploadPath = 'uploads';
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, uploadPath);
      } else {
        //@ts-ignore
        cb(new Error('Invalid file type'));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldnames = [
      'image',
      'profile_image',
      'supporting_Documents',
      'appointment_images',
      'category_image',
      'medical_mySelf_image',
      'medical_family_image',
      'insurance_Photo',
      'article_image',
      'video',
    ];

    if (file.fieldname === undefined) {
      // Allow requests without any files
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
    { name: 'supporting_Documents', maxCount: 4 },
    { name: 'appointment_images', maxCount: 3 },
    { name: 'category_image', maxCount: 1 },
    { name: 'medical_mySelf_image', maxCount: 4 },
    { name: 'medical_family_image', maxCount: 4 },
    { name: 'insurance_Photo', maxCount: 4 },
    { name: 'article_image', maxCount: 2 },
    { name: 'video', maxCount: 1 },
  ]);

  return upload;
};
