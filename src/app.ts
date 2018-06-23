import * as express from 'express';
import * as fs from 'fs';
import { timer } from 'rxjs';
import { argv } from 'yargs';

const PORT = 3001;
const DIR = argv.location || __dirname + '/../photos/';
const UPDATE_FILES = 60 * 60 * 1000; // 1 hour

const app = express();
let files: string[] = [];

timer(0, UPDATE_FILES).subscribe(() => {
  const startCount = files.length;
  files = fs.readdirSync(DIR).filter(file => !file.startsWith('.'));
  const endCount = files.length;
  if (startCount < endCount) {
    console.log(endCount - startCount + ' photos added.');
  }
  if (startCount > endCount) {
    console.log(startCount - endCount + ' photos removed.');
  }
});

app.get('/api/image/random', (req, res) => {
  const randomIndex = Math.floor((Math.random() * files.length));
  res.sendFile(files[randomIndex], { root: DIR });
});

app.listen(PORT, () => {
  console.log(`Foto Server listening on port ${PORT}!`);
});
