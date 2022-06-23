/* eslint-disable @typescript-eslint/no-var-requires */
import { chain } from 'stream-chain';
import { parser } from 'stream-json/jsonl/Parser';

import * as zlib from 'zlib';
import axios from 'axios';

export const jsonStream = async (filePath: string) => {
  const gunzip = zlib.createGunzip();
  axios
    .get('http://files.tmdb.org/p/exports/movie_ids_03_28_2022.json.gz', {
      responseType: 'stream',
    })
    .then((res) => res.data.pipe(gunzip));
  const pipeline = chain([gunzip, parser()]);

  pipeline.on('data', (data) => {
    console.log(data);
  });

  pipeline.on('end', () => {
    console.log('end');
  });
};
