/**
 * Sometimes, if a scheduling job is midway, and the server is restarted, a job
 * can get stuck indefinitely. This service will attempt to restart any stuck jobs.
 */

import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI);

export function restartStuckJobs() {
  client.connect(function (err, db) {
    if (err || !db) {
      console.warn("Could not connect to MongoDB");
      return;
    }

    const agendaJobs = client.db().collection("agendaJobs");

    agendaJobs.updateMany(
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
  });
}
