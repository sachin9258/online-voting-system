// backend/models/vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
{
voter:{
type:mongoose.Schema.Types.ObjectId,
ref:"Voter",
required:true
},

candidate:{
type:mongoose.Schema.Types.ObjectId,
ref:"Candidate",
required:true
},

election:{
type:mongoose.Schema.Types.ObjectId,
ref:"Election",
required:true
},

constituency:{
type:String,
required:true
},

ipAddress:{
type:String,
default:""
},

userAgent:{
type:String,
default:""
},

voteTime:{
type:Date,
default:Date.now
}

},
{timestamps:true}
);

// ================= INDEX FOR FAST COUNT =================
voteSchema.index({election:1});
voteSchema.index({candidate:1});

// ================= SAFE EXPORT =================
const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

export default Vote;