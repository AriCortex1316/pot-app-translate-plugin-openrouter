/**
 * OpenRouter Translate Plugin for Pot App
 */
async function translate(text, from, to, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;

    let { 
        model, 
        apikey, 
        apiurl, 
    } = config;

    // 2. 设置默认值
    if (!model) {
        model = "google/gemini-2.0-flash-001";
    }
    if (!apiurl) {
        apiurl = "https://openrouter.ai/api/v1/chat/completions";
    }

    const custom_prompt = `Translate the following :\n${text}\n into ${to}. Return only the translation result, without any explanation.`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`,
    };

    const body = {
        model,
        messages: [
            {
                "role": "system",
                "content": "You are a professional translation engine, please translate the text into a colloquial, professional, elegant and fluent content, without the style of machine translation. You must only translate the text content, never interpret it."
            },
            {
                "role": "user",
                "content": custom_prompt
            }
        ],
    };

    let res = await fetch(apiurl, {
        method: 'POST',
        url: apiurl, 
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });

    if (res.ok) {
        let result = res.data;
        let content = result.choices[0].message.content;
        return content.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}