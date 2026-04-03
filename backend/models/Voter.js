import mongoose from "mongoose";

// ================= SCHEMA =================
const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },

    aadhaarNumber: {
      type: String,
      required: true,
      unique: true, // Automatically creates an index
      match: [/^[0-9]{12}$/, "Invalid Aadhaar number"]
    },

    dob: {
      type: Date,
      required: true
    },

    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Invalid mobile number"]
    },

    address: {
      type: String,
      required: true
    },

    voterId: {
      type: String,
      unique: true // Index created here
    },

    constituency: {
      type: String,
      default: ""
    },

    photo: {
      type: String,
      required: true
    },

    faceDescriptor: {
      type: [Number],
      default: []
    },

    hasVoted: {
      type: Boolean,
      default: false
    },

    votedParty: {
      type: String,
      default: null
    },

    voteDate: {
      type: String,
      default: null
    },

    voteTime: {
      type: String,
      default: null
    },

    isVerified: {
      type: Boolean,
      default: true
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// ================= AUTO GENERATE VOTER ID =================
// Fixed: Removed 'next' parameter for async middleware compatibility
voterSchema.pre("save", async function () {
  if (!this.voterId) {
    let unique = false;

    // Loop until a unique Voter ID is generated
    while (!unique) {
      const id = "V" + Math.floor(100000 + Math.random() * 900000);
      
      // Check if ID already exists in the collection
      const exists = await mongoose.models.Voter.findOne({ voterId: id });

      if (!exists) {
        this.voterId = id;
        unique = true;
      }
    }
  }
});

// ================= METHODS =================

// Static method to fetch voter by Aadhaar Number
voterSchema.statics.findByAadhaar = function (aadhaar) {
  return this.findOne({ aadhaarNumber: aadhaar });
};

// Instance method to check if user is eligible to vote
voterSchema.methods.canVote = function () {
  return this.isVerified && !this.hasVoted && !this.isBlocked;
};

// Instance method to cast a vote and record timestamp
voterSchema.methods.castVote = function (party) {
  if (!this.canVote()) {
    throw new Error("Not eligible to vote");
  }

  const now = new Date();

  this.hasVoted = true;
  this.votedParty = party;
  this.voteDate = now.toLocaleDateString("en-GB");
  this.voteTime = now.toLocaleTimeString("en-GB");
};

// Instance method for face matching logic
voterSchema.methods.compareFace = function (queryDescriptor, threshold = 0.5) {
  if (!this.faceDescriptor || this.faceDescriptor.length !== 128) return false;

  let sum = 0;
  for (let i = 0; i < 128; i++) {
    const diff = this.faceDescriptor[i] - queryDescriptor[i];
    sum += diff * diff;
  }

  const dist = Math.sqrt(sum);
  console.log(`🔍 ${this.name} match distance: ${dist.toFixed(4)}`);

  return dist < threshold;
};

// ================= EXPORT =================
const Voter = mongoose.models.Voter || mongoose.model("Voter", voterSchema);

export default Voter;