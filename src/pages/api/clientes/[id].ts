import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("clientes");

      const cliente = await collection.findOne({ _id: new ObjectId(id) });

      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
  } else if (req.method === "PUT") {
    try {
      const { dDocumento, dNombre, dDireccion, dTelefono, dCorreo } = req.body;

      if (!dDocumento || !dNombre || !dDireccion || !dTelefono || !dCorreo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }

      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("clientes");

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { dDocumento, dNombre, dDireccion, dTelefono, dCorreo } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("sena");
      const collection = db.collection("clientes");

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);
