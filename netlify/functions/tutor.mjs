const MODEL = 'Qwen/Qwen3-4B-Instruct-2507:nscale';
const ENDPOINT = 'https://router.huggingface.co/v1/chat/completions';

const MODE_GUIDANCE = {
  simple: `Explain the user's topic in clear, beginner-friendly English. Start with a one-sentence definition, then use a familiar everyday analogy, one step-by-step example, and a short recap. Use headings and short paragraphs. Do not pretend every answer is certain; state uncertainty when relevant.`,
  hausa: `Explain the user's topic in Hausa (use clear, accessible Hausa, not overly formal language). Keep important technical terms in English in parentheses where helpful. Use a simple everyday analogy, one worked example, and a brief recap. If you are unsure of a Hausa technical translation, say so instead of inventing a term.`,
  quiz: `Create a short beginner-friendly practice quiz about the user's topic: 5 numbered questions with a mix of multiple-choice and short-answer questions. Put the answer key in a final section labelled ANSWER KEY so a learner can try first. Keep questions accurate and appropriate for a student.`,
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Use POST to ask a study question.' }), {
      status: 405, headers: { 'Content-Type': 'application/json', 'Allow': 'POST' }
    });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'The app is not connected to its AI model yet. Add HF_TOKEN in your Netlify environment variables, then redeploy.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  let payload;
  try { payload = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Please send a valid question.' }), { status: 400, headers: { 'Content-Type': 'application/json' } }); }

  const topic = typeof payload.topic === 'string' ? payload.topic.trim().slice(0, 1200) : '';
  const requestedMode = payload && typeof payload === 'object' ? payload.mode : 'simple';
  const mode = Object.hasOwn(MODE_GUIDANCE, requestedMode) ? requestedMode : 'simple';
  if (!topic) {
    return new Response(JSON.stringify({ error: 'Enter a topic or question first.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const upstream = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: `You are HausaPath AI, a careful learning assistant for students in Gombe, Nigeria. ${MODE_GUIDANCE[mode]} Be educational and respectful. Do not provide fabricated citations or claim to replace a qualified teacher. If asked for medical, legal, or dangerous advice, give a brief safe response and recommend qualified help.` },
          { role: 'user', content: topic }
        ],
        max_tokens: 700,
        temperature: 0.55
      })
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const details = data?.error?.message || data?.error || `AI provider returned status ${upstream.status}.`;
      const friendly = upstream.status === 401 || upstream.status === 403
        ? 'The AI token is invalid or does not have Inference Providers permission. Check HF_TOKEN in Netlify.'
        : upstream.status === 402
          ? 'The AI provider requires available credits. Check your Hugging Face Inference Providers billing or select an eligible provider/model.'
          : String(details).slice(0, 300);
      return new Response(JSON.stringify({ error: friendly }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer || typeof answer !== 'string') {
      return new Response(JSON.stringify({ error: 'The model returned no text. Please try again.' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ answer, model: MODEL }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Could not reach the AI provider. Check your connection and try again.' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }
};
