// src/lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

// URL de conexión a MongoDB 
const uri = "mongodb://localhost:27017/sena";
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usa un cliente MongoDB persistente para habilitar la recarga rápida.
  if (globalThis._mongoClientPromise) {
    clientPromise = globalThis._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
    clientPromise = globalThis._mongoClientPromise;
  }
} else {
  // En producción, no reutilices la conexión entre invocaciones.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
