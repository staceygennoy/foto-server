import * as express from 'express';
import * as fs from 'fs';
import { Observable } from 'rxjs';
import { argv } from 'yargs';

const PORT = 3001;
const DIR = argv.location || __dirname + '/../photos/';
const UPDATE_FILES = 60 * 60 * 1000; // 1 hour

const app = express();
let files: string[] = [];

Observable.timer(0, UPDATE_FILES).subscribe(() => files = fs.readdirSync(DIR));

app.get('/api/image/random', (req, res) => {
  const randomIndex = Math.floor((Math.random() * files.length));
  res.sendFile(files[randomIndex], { root: DIR });
});

app.listen(PORT, () => {
  console.log(`Foto Server listening on port ${PORT}!`);
});
