import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, category, price, specifications } = body;

        // Using Groq which is globally free and un-restricted!
        const apiKey = process.env.GROQ_API_KEY; 
        
        if (!apiKey) {
            return NextResponse.json({ error: "GROQ_API_KEY is not defined in the environment variables." }, { status: 500 });
        }

        const formattedSpecs = specifications && specifications.length > 0 
            ? specifications.map((s: any) => `- ${s.label}: ${s.value}`).join('\n') 
            : "No specific details logged";

        const prompt = `
            Generate a high-converting product description based on the following data:
            
            Name: ${name || 'N/A'}
            Category: ${category || 'N/A'}
            Price: ${price ? `₹${price}` : 'N/A'}
            Specifications: 
            ${formattedSpecs}
            
            Guidelines:
            - Write in natural, fluent English
            - Keep it between 80–120 words
            - Focus on benefits, comfort, and usability
            - Make it sound premium and trustworthy
            - Do not repeat raw data directly
            - Adapt tone based on product category
            - Avoid generic phrases like "good quality product"
            - Prioritize SEO content optimizations
            
            Return ONLY the single paragraph description block. Do not wrap in quotes, greetings, or code blocks.
        `;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Insanely fast globally free Llama 3.3 model
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        if (!groqResponse.ok) {
            const errBody = await groqResponse.text();
            console.error("Groq API Error:", errBody);
            throw new Error(`Groq Status ${groqResponse.status}`);
        }

        const data = await groqResponse.json();
        const textResponse = data.choices[0].message.content;

        // Strip any residual markdown formatting or newlines that LLMs sometimes hallucinate
        const cleanDescription = textResponse.replace(/^```(\w+)?\n/, "").replace(/\n```$/, "").trim();

        return NextResponse.json({ description: cleanDescription });
    } catch (error: any) {
        console.error("AI Description Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
    }
}
