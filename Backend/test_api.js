require("dotenv").config()

const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

console.log("API KEY set?", !!process.env.GOOGLE_GENAI_API_KEY)
console.log("MONGO_URI set?", !!process.env.MONGO_URI)

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
    behavioralQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
    skillGaps: z.array(z.object({ skill: z.string(), severity: z.enum(["low", "medium", "high"]) })),
    preparationPlan: z.array(z.object({ day: z.number(), focus: z.string(), tasks: z.array(z.string()) })),
    title: z.string(),
})

async function test() {
    console.log("\nTesting Gemini API...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Generate an interview report for a junior React developer applying to a frontend role at a startup.",
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })
        const result = JSON.parse(response.text)
        console.log("SUCCESS! matchScore:", result.matchScore)
        console.log("title:", result.title)
        console.log("technicalQuestions count:", result.technicalQuestions?.length)
        console.log("preparationPlan count:", result.preparationPlan?.length)
    } catch (err) {
        console.error("GEMINI ERROR:", err.message)
        if (err.status) console.error("Status:", err.status)
        if (err.errorDetails) console.error("Details:", JSON.stringify(err.errorDetails))
    }
}

test()
