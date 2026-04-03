import Vote from "../models/Vote.js";
import mongoose from "mongoose";

export const liveCount = async (req, res) => {
  const result = await Vote.aggregate([
    { $match: { election: mongoose.Types.ObjectId(req.params.id) } },
    { $group: { _id: "$candidate", total: { $sum: 1 } } }
  ]);
  res.json(result);
};

export const declareResult = async (req, res) => {
  const result = await Vote.aggregate([
    { $match: { election: mongoose.Types.ObjectId(req.params.id) } },
    { $group: { _id: "$candidate", total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
  res.json(result);
};