import Busboy from 'busboy';
import mongoose from 'mongoose';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import unzipper from 'unzipper';
import Fabric from '../models/Fabric.js';

const getBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db);

const parseTechPdfFromZip = async (zipStream) => {
  for await (const entry of zipStream) {
    if (entry.path.toLowerCase().endsWith('.pdf')) {
      const chunks = [];
      for await (const chunk of entry) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      const uint8 = new Uint8Array(buffer);
        const loadingTask = pdfjsLib.getDocument({ data: uint8 });
        const pdf = await loadingTask.promise;

        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ');
        }

      const abrasion = text.match(/Martindale.*?(\d+)/i)?.[1];
      const width = text.match(/Szerokość.*?(\d+)/i)?.[1];
      const composition = text.match(/Skład.*?:\s*(.+)/i)?.[1];
      const weight = text.match(/Gramatura.*?(\d+)/i)?.[1];

      return {
        abrasion: abrasion ? Number(abrasion) : undefined,
        width: width ? Number(width) : undefined,
        composition: composition?.trim(),
        weight: weight ? Number(weight) : undefined,
      };
    }
    entry.autodrain();
  }

  throw new Error('PDF not found in technical ZIP');
};

export const importDavisCatalog = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const bucket = getBucket();

  let brand;
  let collection;

  let techZipId;
  let imagesZipId;

  const uploads = [];

  busboy.on('field', (name, value) => {
    if (name === 'brand') brand = value;
    if (name === 'collection') collection = value;
  });

  busboy.on('file', (name, file, info) => {
    const uploadStream = bucket.openUploadStream(info.filename);
    file.pipe(uploadStream);

    uploads.push(
      new Promise((resolve) => {
        uploadStream.on('finish', () => {
          if (name === 'techZip') techZipId = uploadStream.id;
          if (name === 'imagesZip') imagesZipId = uploadStream.id;
          resolve();
        });
      })
    );
  });

  busboy.on('finish', async () => {
    try {
      await Promise.all(uploads);

      if (!brand || !collection || !techZipId || !imagesZipId) {
        return res.status(400).json({ message: 'Missing data or files' });
      }

      // 1️⃣ ТЕХНИЧЕСКИЕ ДАННЫЕ (ZIP → PDF)
      const techZipStream = bucket
        .openDownloadStream(techZipId)
        .pipe(unzipper.Parse({ forceStream: true }));

      const techData = await parseTechPdfFromZip(techZipStream);

      // 2️⃣ ИЗОБРАЖЕНИЯ (ZIP → JPG)
      const imagesZipStream = bucket
        .openDownloadStream(imagesZipId)
        .pipe(unzipper.Parse({ forceStream: true }));

      let created = 0;

      for await (const entry of imagesZipStream) {
        if (!entry.path.toLowerCase().endsWith('.jpg')) {
          entry.autodrain();
          continue;
        }

        const colorMatch = entry.path.match(/(\d{2,3})/);
        if (!colorMatch) {
          entry.autodrain();
          continue;
        }

        const colorCode = colorMatch[1];

        const imageUpload = bucket.openUploadStream(entry.path);
        entry.pipe(imageUpload);
        await new Promise((r) => imageUpload.on('finish', r));

        await Fabric.create({
          name: collection,
          brand,
          collection,
          colorName: colorCode,
          colorCode,
          ...techData,
          pricePerMeter: 0,
          images: [imageUpload.id],
        });

        created++;
      }

      res.json({
        message: 'Davis catalog imported',
        created,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message || 'Import failed' });
    }
  });

  req.pipe(busboy);
};
