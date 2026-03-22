require('dotenv').config();
const { generateInterviewReport } = require('./src/services/ai.service');

async function test() {
    try {
        const report = await generateInterviewReport({
            resume: "test resume",
            selfDescription: "test description",
            jobDescription: "test job"
        });
        console.log("SUCCESS:", JSON.stringify(report).substring(0, 100));
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}
test();
