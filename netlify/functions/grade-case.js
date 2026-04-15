export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { caseTitle, caseNumber, questions, responses, weekId } = body;

    if (!questions || !responses) {
      return new Response(JSON.stringify({ error: 'Missing questions or responses' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the grading prompt
    const qaPairs = questions.map((q, i) => {
      const response = responses[q.id] || '(No response provided)';
      return `QUESTION ${q.id}:\n${q.prompt}\n\nMinimum word count: ${q.wordMin || 'None'}\n\nSTUDENT RESPONSE:\n${response}`;
    }).join('\n\n---\n\n');

    const systemPrompt = `You are an experienced accounting professor grading case study responses for a Financial Accounting (ACCT 301) course. The students are international ESL students at the undergraduate level.

Grade each question response on a scale of 0-100 using this rubric:
- 90-100 (Excellent): Demonstrates thorough understanding, applies concepts correctly, uses specific data from the case, well-organized response
- 80-89 (Good): Shows solid understanding with minor gaps, mostly correct application of concepts, references case data
- 70-79 (Satisfactory): Basic understanding demonstrated, some errors in application, limited use of case data
- 60-69 (Needs Improvement): Partial understanding, significant errors, vague or incomplete response
- Below 60 (Unsatisfactory): Major misunderstandings, missing key concepts, does not meet minimum requirements

For each question, provide:
1. A numerical score (0-100)
2. Brief specific feedback (2-3 sentences) explaining the score — what was done well and what could be improved
3. Be encouraging but honest — these are ESL students who are learning

Also provide an overall case score (weighted average of the question scores) and 1-2 sentences of overall feedback.

Respond ONLY in this exact JSON format:
{
  "questions": {
    "1": { "score": 85, "feedback": "Your feedback here..." },
    "2": { "score": 78, "feedback": "Your feedback here..." },
    "3": { "score": 90, "feedback": "Your feedback here..." }
  },
  "overall": { "score": 84, "feedback": "Overall feedback here..." }
}`;

    const userPrompt = `Please grade the following student responses for case study ${caseNumber}: "${caseTitle}" (Week ${weekId}).\n\n${qaPairs}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: `Claude API error: ${response.status}`, details: err }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse the JSON from Claude's response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: 'Could not parse grading response', raw: text }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const grades = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(grades), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/.netlify/functions/grade-case',
};
