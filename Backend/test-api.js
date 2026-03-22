const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function test() {
    try {
        const timestamp = Date.now();
        const registerRes = await axios.post('http://localhost:3000/api/auth/register', {
            username: `ai_test_${timestamp}`,
            email: `ai_test_${timestamp}@example.com`,
            password: "password123"
        });
        const cookies = registerRes.headers['set-cookie'];
        
        const formData = new FormData();
        formData.append("selfDescription", "I am a dev");
        formData.append("jobDescription", "Needs a dev");

        const res = await axios.post('http://localhost:3000/api/interview/', formData, {
            headers: {
                ...formData.getHeaders(),
                Cookie: cookies[0]
            }
        });
        console.log("SUCCESS");
    } catch (e) {
        console.error("API ERROR:", e.response ? e.response.data : e.message);
    }
}
test();
