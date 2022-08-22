import * as dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.ARWEAVE_PORT || 443,
  host: process.env.ARWEAVE_HOST || "arweave.net",
  protocol: process.env.ARWEAVE_PROTOCOL || "https",
};

export default config;
