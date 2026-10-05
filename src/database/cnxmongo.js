import dns from "node:dns";
import mongoose from "mongoose";

export default async function conectar() {
  const uri = process.env.MONGODB_URI;
  const dnsServers = process.env.MONGODB_DNS_SERVERS;

  if (!uri) {
    throw new Error("Falta configurar la variable MONGODB_URI");
  }

  if (dnsServers) {
    dns.setServers(dnsServers.split(",").map((server) => server.trim()));
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "numerologia"
  });

  console.log(`MongoDB conectado a la base de datos ${mongoose.connection.name}`);
}