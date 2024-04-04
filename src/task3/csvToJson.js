import fs from 'node:fs';
import { pipeline } from 'node:stream';
import csvtojson from 'csvtojson';

export default function csvToJson(csvFilePath, txtFilePath) {
  const txtStream = fs.createWriteStream(txtFilePath);

  pipeline(csvtojson().fromFile(csvFilePath).subscribe(), txtStream, (err) => {
    if (err) {
      console.error('Pipeline failed: ', err);
    } else {
      console.log('Pipeline completed successfully');
    }
  });
}
