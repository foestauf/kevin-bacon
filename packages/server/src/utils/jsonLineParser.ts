import * as fs from 'fs';

export const jsonLineParser = (filePath: string) => {
  return new Promise<any[]>((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          data
            .split('\n')
            .filter((line) => {
              try {
                JSON.parse(line);
                return true;
              } catch (error) {
                return false;
              }
            })
            .map((line) => JSON.parse(line)),
        );
      }
    });
  });
};
