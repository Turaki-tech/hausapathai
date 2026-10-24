import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const examples = [
  { title: 'Recursion', topic: 'Explain recursion in programming with a simple everyday example.' },
  { title: 'Mean, median & mode', topic: 'Teach me the difference between mean, median, and mode with one worked example.' },
  { title: 'Database keys', topic: 'Explain primary keys and foreign keys with a simple student database example.' },
];

function App() {
  const [topic, setTopic] = React.useState('');
  const [mode, setMode] = React.useState('simple');
  const [result, setResult] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  async function submit(e) {
    e?.preventDefault();
    if (!topic.trim()) {
      setError('Write a topic or question first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    setCopied(false);
    try {
      const response = await fetch('/.netlify/functions/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), mode }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The AI service did not respond. Please try again.');
      if (!data.answer) throw new Error('The AI returned an empty answer. Please try a different topic.');
      setResult(data.answer);
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy is not available in this browser. Select the answer and copy it manually.');
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="HausaPath AI home">
          <span className="brand-mark">H<span>+</span></span>
          <span className="brand-name">HausaPath <b>AI</b></span>
        </a>
        <div className="open-pill"><span className="status-dot" /> Open-weight AI</div>
      </header>

      <main id="top" className="main-layout">
        <section className="intro">
          <div className="eyebrow"><span className="eyebrow-line" /> LEARN WITHOUT GETTING LOST</div>
          <h1>Understand it.<br /><span>In your own way.</span></h1>
          <p className="intro-copy">A study companion that breaks difficult topics into simple steps, supports Hausa explanations, and helps you practise what you learn.</p>
          <div className="value-row">
            <div className="value-item"><span className="value-icon">01</span><span>Simple explanations</span></div>
            <div className="value-item"><span className="value-icon">02</span><span>Hausa support</span></div>
            <div className="value-item"><span className="value-icon">03</span><span>Quick practice</span></div>
          </div>
          <div className="local-note"><span className="local-symbol">✳</span><span>Made with students in mind, starting from Gombe.</span></div>
        </section>

        <section className="workspace" aria-label="AI learning workspace">
          <div className="workspace-head">
            <div><div className="section-kicker">YOUR STUDY SPACE</div><h2>What are you learning today?</h2></div>
            <div className="sparkle">✳</div>
          </div>
          <div className="mode-label">CHOOSE HOW YOU WANT TO LEARN</div>
          <div className="mode-grid" role="group" aria-label="Learning mode">
            <button className={`mode-card ${mode === 'simple' ? 'selected' : ''}`} onClick={() => setMode('simple')} type="button">
              <span className="mode-icon">Aa</span><span className="mode-title">Simple English</span><span className="mode-desc">Break it down</span><span className="radio-dot" />
            </button>
            <button className={`mode-card ${mode === 'hausa' ? 'selected' : ''}`} onClick={() => setMode('hausa')} type="button">
              <span className="mode-icon hausa-icon">Ha</span><span className="mode-title">Explain in Hausa</span><span className="mode-desc">Bayani da Hausa</span><span className="radio-dot" />
            </button>
            <button className={`mode-card ${mode === 'quiz' ? 'selected' : ''}`} onClick={() => setMode('quiz')} type="button">
              <span className="mode-icon quiz-icon">✓?</span><span className="mode-title">Practice quiz</span><span className="mode-desc">Test your knowledge</span><span className="radio-dot" />
            </button>
          </div>

          <form onSubmit={submit}>
            <label className="input-label" htmlFor="topic">YOUR TOPIC OR QUESTION</label>
            <textarea id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Explain recursion like I am a beginner..." rows={4} maxLength={1200} />
            <div className="input-foot"><span>Be specific for a more useful answer.</span><span>{topic.length}/1200</span></div>
            <div className="examples-label">NEED AN IDEA? TRY ONE</div>
            <div className="example-row">
              {examples.map((ex) => <button type="button" className="example-chip" key={ex.title} onClick={() => setTopic(ex.topic)}>{ex.title}<span>↗</span></button>)}
            </div>
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Thinking through it…</> : <>Help me understand <span>↗</span></>}
            </button>
            <p className="privacy-note"><span>◇</span> Your question is sent to the AI model to generate an answer. Do not enter private information.</p>
          </form>

          {(result || error || loading) && <section className="answer-panel" aria-live="polite">
            <div className="answer-head"><div><div className="section-kicker">YOUR LEARNING NOTES</div><h3>{loading ? 'Preparing your explanation' : error ? 'One small issue' : mode === 'quiz' ? 'Practice time' : mode === 'hausa' ? 'Bayani da Hausa' : 'Let’s make it clear'}</h3></div>{result && <button className="copy-button" type="button" onClick={copyAnswer}>{copied ? 'Copied ✓' : 'Copy notes ↗'}</button>}</div>
            {loading ? <div className="loading-lines"><i /><i /><i /></div> : result ? <div className="answer-text">{result.split('\n').map((line, i) => line.trim() ? <p key={i}>{line}</p> : <div key={i} className="answer-space" />)}</div> : <p className="error-text">{error}</p>}
          </section>}
        </section>
      </main>
      <footer className="footer"><div className="footer-brand">HausaPath AI <span>·</span> Built for learning, shared openly.</div><div className="footer-right">An open-source student project <span className="footer-dot">●</span></div></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
