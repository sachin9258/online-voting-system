const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    voterId: String,
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    voteHash: String,
    timestamp: { type: Date, default: Date.now }
});

voteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
