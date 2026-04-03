import mongoose from "mongoose";

const nominationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  },
  status: {
    type: String,
    default: "Pending"
  },
  ticketId: String,
  createdAt: { type: Date, default: Date.now }
});

const Nomination = mongoose.models.Nomination || mongoose.model("Nomination", nominationSchema);
export default Nomination;