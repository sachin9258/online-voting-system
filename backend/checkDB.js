// checkDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const voterSchema = new mongoose.Schema({}, { strict: false });
const Voter = mongoose.model("Voter", voterSchema);

async function checkVoters() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // no extra options
    console.log("MongoDB connected");

    const voters = await Voter.find();
    console.log("Voters in DB:");
    voters.forEach((voter, i) => {
      console.log(`${i + 1}. Name: ${voter.name}, Email: ${voter.email}`);
    });

    process.exit();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

checkVoters();
