import Arweave from "arweave";
import Transaction from "arweave/node/lib/transaction";
import fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import mime from "mime-types";
import cliProgress from "cli-progress";
import config from "./config";

const client = new Arweave({
  host: config.host,
  port: config.port,
  protocol: config.protocol,
});

const files: {
  slug: string;
  path: string;
  id: string;
  cost: number;
  size: number;
  data: Buffer;
}[] = [];
const txs: Transaction[] = [];

const getFiles = async (dir: string, subdir?: string) => {
  if (!subdir) console.log(`\n Preparing files from ${dir}`);
  const _ = fs.readdirSync(subdir || dir);
  for (const file of _) {
    const path = (subdir || dir) + "/" + file;
    if (fs.statSync(path).isDirectory()) {
      getFiles(dir, path);
    } else {
      let slug = path.split(dir)[1].split(".html")[0];
      if (slug.startsWith("/")) slug = slug.substr(1);
      if (slug.endsWith("/index")) slug = slug.substr(0, slug.length - 6);

      const filePath = path.split(dir)[1].startsWith("/")
        ? path.split(dir)[1].substr(1)
        : path.split(dir)[1];
      if (
        !(
          filePath.startsWith(".git") ||
          filePath.startsWith(".DS_Store") ||
          filePath.indexOf("README") !== -1 ||
          filePath.indexOf("LICENSE") !== -1
        )
      ) {
        files.push({
          slug,
          path: filePath,
          id: "",
          cost: 0,
          size: fs.statSync(path).size,
          data: fs.readFileSync(path),
        });
      }
    }
  }
};

const createTxs = async (jwk: JWKInterface) => {
  console.log(
    `\n ${"ID".padEnd(43)} ${"Size".padEnd(12)} ${"Fee".padEnd(15)} ${"Path"}`
  );
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const tx = await client.createTransaction(
      {
        data: file.data,
      },
      jwk
    );
    tx.addTag("App-Name", `ArGoApp/2.0.0`);
    tx.addTag("Content-Type", mime.lookup(file.path) || "text/plain");

    await client.transactions.sign(tx, jwk);
    txs.push(tx);

    files[i].id = tx.id;
    files[i].cost = parseFloat(client.ar.winstonToAr(tx.reward));

    console.log(
      ` ${files[i].id} ${`${files[i].size} B`.padEnd(12)} ${files[i].cost
        .toString()
        .padEnd(15)} ${files[i].path}`
    );
  }
};

(async () => {
  await getFiles(process.argv[2]);
  const jwk = JSON.parse(fs.readFileSync(process.argv[3]).toString());
  await createTxs(jwk);

  let totalCost = 0,
    totalSize = 0;

  let data = {
    manifest: "arweave/paths",
    version: "0.1.0",
    index: {},
    paths: {},
  };
  const index = files.find((file) => file.slug === "index");
  if (index) {
    data.index = { path: "index" };
  }
  for (const file of files) {
    data.paths = {
      ...data.paths,
      [file.slug]: {
        id: file.id,
      },
    };
    totalCost += file.cost;
    totalSize += file.size;
  }

  const tx = await client.createTransaction(
    {
      data: JSON.stringify(data),
    },
    jwk
  );
  tx.addTag("App-Name", `ArGoApp/2.0.0`);
  tx.addTag("Content-Type", "application/x.arweave-manifest+json");

  await client.transactions.sign(tx, jwk);
  txs.push(tx);

  totalCost += parseFloat(client.ar.winstonToAr(tx.reward));
  totalSize += parseFloat(tx.data_size);

  console.log(
    `\n ${tx.id} ${`${tx.data_size} B`.padEnd(12)} ${client.ar
      .winstonToAr(tx.reward)
      .padEnd(15)} ${"application/x.arweave-manifest+json"}`
  );

  console.log(
    `\n\n Summary\n\n Index: ${
      // @ts-ignore
      index ? index.path : "not set"
    }\n Number of files: ${
      files.length
    } + 1 manifest\n Total size: ${totalSize} B\n Total price: ${totalCost} AR`
  );

  console.log("\n\n Uploading ...\n\n");

  const prog = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  prog.start(txs.length, 1);
  for (let i = 0; i < txs.length; i++) {
    let uploader = await client.transactions.getUploader(txs[i]);
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }
    prog.update(i + 1);
  }
  prog.stop();

  console.log(
    `\n\n Your files are being deployed! 🚀\n Once your files are mined into blocks they'll be available on the following URL\n\n https://arweave.net/${tx.id}`
  );
})();
