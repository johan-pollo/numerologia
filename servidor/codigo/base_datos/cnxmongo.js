import dns from "node:dns";
import mongoose from "mongoose";

export async function connectToMongoDB() {
  const uri = process.env.MONGO_URI;
  const dnsServers = process.env.MONGODB_DNS_SERVERS;

  if (!uri) {
    throw new Error("Falta configurar la variable MONGO_URI");
  }

  if (dnsServers) {
    dns.setServers(dnsServers.split(",").map((server) => server.trim()));
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "numerologia"
  });

  console.log("You successfully connected to MongoDB!");
  return mongoose.connection;
}

export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}

export default connectToMongoDB;