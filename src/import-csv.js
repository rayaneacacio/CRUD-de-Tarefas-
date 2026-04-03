import fs from 'node:fs';
import { parse } from "csv-parse";

const csvPath = new URL('../tasks.csv', import.meta.url);

(async () => {
  const parser = fs.createReadStream(csvPath).pipe(parse({
    columns: true,
  }));

  process.stdout.write("start\n");

  for await (const chunk of parser) {
    const { title, description } = chunk;
  
    process.stdout.write(`${title},${description}\n`); 

    await fetch('http://localhost:3333/task', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  process.stdout.write("...done\n");
})();