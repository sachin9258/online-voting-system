import User from "../models/User.js";
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import Complaint from "../models/Complaint.js";

// 📊 Dashboard Stats 
export const getDashboardStats = async (req, res) => {
    try {
        const totalVoters = await User.countDocuments({ role: "voter" });
        const totalVotes = await Vote.countDocuments();
        const activeCandidates = await Candidate.countDocuments();
        res.status(200).json({ success: true, stats: { totalVoters, totalVotes, activeCandidates, turnout: ((totalVotes/totalVoters)*100 || 0).toFixed(2) + "%" } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// 🗳️ Live Results (
export const getLiveResults = async (req, res) => {
    try {
        const votes = await Vote.find().populate("voterId", "name voterId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, votes });
    } catch (err) { res.status(500).json({ success: false, message: "Live logs failed" }); }
};

// 👥 Candidates
export const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ updatedAt: -1 });
        res.status(200).json({ success: true, candidates });
    } catch (err) { res.status(500).json({ success: false, message: "Candidates failed" }); }
};

// ⚖️ Complaints 
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate("candidateId", "name party");
        res.status(200).json({ success: true, complaints });
    } catch (err) { res.status(500).json({ success: false, message: "Complaints failed" }); }
};


export const approveCandidate = async (req, res) => { res.json({success:true}); };
export const rejectCandidate = async (req, res) => { res.json({success:true}); };
export const getAllVoters = async (req, res) => { const v = await User.find({role:'voter'}); res.json({success:true, voters:v}); };
export const approveVoter = async (req, res) => { res.json({success:true}); };
export const blockVoter = async (req, res) => { res.json({success:true}); };
export const getAllElections = async (req, res) => { res.json({success:true, elections:[]}); };
export const createElection = async (req, res) => { res.json({success:true}); };
export const startElection = async (req, res) => { res.json({success:true}); };
export const stopElection = async (req, res) => { res.json({success:true}); };
export const getTurnout = async (req, res) => { res.json({success:true}); };
export const getResults = async (req, res) => { res.json({success:true}); };
export const getStateResults = async (req, res) => { res.json({success:true}); };