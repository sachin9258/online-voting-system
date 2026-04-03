import Candidate from "../models/Candidate.js";
import Complaint from "../models/Complaint.js"; 
import jwt from "jsonwebtoken";

// ================= NEW FUNCTION FOR TRACK.HTML =================
// GET ALL: Constituency ke basis par candidates search karne ke liye
export const getAllCandidates = async (req, res) => {
    try {
        const { constituency } = req.query;
        let query = {};

        // Agar constituency provide ki gayi hai toh filter lagayein
        if (constituency) {
            query.constituency = new RegExp(constituency, 'i'); // Case-insensitive search
        }

        // Database se data fetch karein (Public fields only)
        // Note: Hum status: "approved" bhi add kar sakte hain agar sirf verify candidates dikhane hon
        const candidates = await Candidate.find(query).select(
            "name party constituency assets criminalRecords education status"
        );

        res.status(200).json(candidates);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ success: false, msg: "Error fetching candidates" });
    }
};

// 1. REGISTER: Naya Candidate Signup
export const registerCandidate = async (req, res) => {
    try {
        const { name, email, aadhaarNumber, partyName, constituency, password } = req.body;

        const existing = await Candidate.findOne({ $or: [{ email }, { aadhaar: aadhaarNumber }] });
        if (existing) return res.status(400).json({ success: false, msg: "Email or Aadhaar already exists!" });

        const newCandidate = new Candidate({
            name,
            email,
            aadhaar: aadhaarNumber, 
            party: partyName,       
            constituency,
            password,               
            status: "pending",
            // Default values for new fields
            assets: 0,
            criminalRecords: "None",
            education: "Not Specified"
        });

        await newCandidate.save();
        res.status(201).json({ success: true, msg: "Candidate Registered Successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Registration Error: " + err.message });
    }
};

// 2. LOGIN: Candidate Verification
export const loginCandidate = async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await Candidate.findOne({ email, password });

        if (!candidate) return res.status(401).json({ success: false, msg: "Invalid Email or Password" });

        const token = jwt.sign(
            { id: candidate._id, role: "candidate" },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "1d" }
        );

        res.json({ 
            success: true, 
            token, 
            candidateId: candidate._id, 
            msg: `Welcome back, ${candidate.name}` 
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Login Error" });
    }
};

// 3. GET PROFILE BY ID
export const getProfileById = async (req, res) => {
    try {
        const { id } = req.query; 
        const candidate = await Candidate.findById(id);
        
        if (!candidate) return res.status(404).json({ success: false, msg: "Profile not found" });
        
        res.json({ success: true, candidate });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error fetching profile" });
    }
};

// 4. UPDATE PROFILE: Nomination Details update
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.query; 
        const updateData = req.body; 

        const updated = await Candidate.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updated) return res.status(404).json({ success: false, msg: "Candidate not found" });

        res.json({ success: true, msg: "Nomination Details Updated!", candidate: updated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Update Error: " + err.message });
    }
};

// 5. FILE COMPLAINT
export const fileComplaint = async (req, res) => {
    try {
        const { candidateId, violationType, description } = req.body;

        const newComplaint = new Complaint({
            candidateId,
            violationType,
            description,
            status: "Pending"
        });

        await newComplaint.save();
        res.status(201).json({ success: true, msg: "Complaint filed successfully with ECI!" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Complaint Error: " + err.message });
    }
};

// 6. MY VOTES: Live counting updates
export const myVotes = async (req, res) => {
    try {
        const voteCount = 0; 
        res.json({ success: true, votes: voteCount });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Vote counting error" });
    }
};