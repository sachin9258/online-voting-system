import bcrypt from "bcrypt";

async function generate() {

const sdmPassword = "systemadmin@sdm"
const eciPassword = "eci@gov.admin"

const sdmHash = await bcrypt.hash(sdmPassword,10)
const eciHash = await bcrypt.hash(eciPassword,10)

console.log("SDM HASH:",sdmHash)
console.log("ECI HASH:",eciHash)

}

generate() 