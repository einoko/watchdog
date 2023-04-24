/**
 * Sometimes, if a scheduling job is in progress, and the server is restarted, a job
 * can get stuck indefinitely. This service will attempt to restart any stuck jobs.
 */
import { MongoClient } from "mongodb";
import "dotenv/config";
import { getMongoURI } from "../db.js";

const client = new MongoClient(getMongoURI());

export async function restartStuckJobs() {
  const db = await client.connect();

  if (!db) {
    console.warn("Could not connect to MongoDB");
    return;
  }

  const agendaJobs = client.db().collection("agendaJobs");

  await agendaJobs.updateMany(
    {
      lockedAt: {
        $exists: true,
      },
      lastFinishedAt: {
        $exists: false,
      },
    },
    {
      $unset: {
        lockedAt: undefined,
        lastModifiedBy: undefined,
        lastRunAt: undefined,
      },
      $set: {
        nextRunAt: new Date(),
      },
    }
  );

  console.log("Jobs restarted.");
}
