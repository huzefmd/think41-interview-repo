import fs from "fs";
import csv from "csv-parser";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function importUsersFromCSV(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      data.age = parseInt(data.age);
      data.latitude = parseFloat(data.latitude);
      data.longitude = parseFloat(data.longitude);
      data.created_at = new Date(data.created_at).toISOString();
      results.push(data);
    })
    .on("end", async () => {
      const { data, error } = await supabase.from("users").insert(results);

      if (error) {
        console.error(" Error inserting data:", error);
      } else {
        console.log(" Successfully inserted users:", data.length);
      }
    });
}


importUsersFromCSV("users.csv");
