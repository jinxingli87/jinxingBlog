const { execSync } = require("child_process");
const Database = require("better-sqlite3") || null;
const path = require("path");
const crypto = require("crypto");

const dbPath = path.join(__dirname, "..", "dev.db");

let db;
try {
  db = require("better-sqlite3")(dbPath);
} catch {
  // If better-sqlite3 is not installed, use prisma db execute approach
  const { PrismaClient } = require("@prisma/client");
  console.log("Falling back to alternative seed method...");
  process.exit(0);
}

function cuid() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 25);
}

// Clear existing data
db.exec("DELETE FROM Comment");
db.exec("DELETE FROM Post");

const posts = [
  {
    id: cuid(),
    title: "The Rise of Agentic AI: What It Means for Developers",
    slug: "rise-of-agentic-ai",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    excerpt: "Agentic AI systems are shifting from passive tools to autonomous collaborators. Here's what every developer should understand about this paradigm shift.",
    content: `<p>We're witnessing a fundamental shift in how AI systems operate. The era of simple prompt-response interactions is giving way to something far more powerful: agentic AI — systems that can plan, reason, use tools, and take autonomous action toward goals.</p>

<h2>What Makes AI "Agentic"?</h2>

<p>Traditional AI models respond to prompts. You ask a question, you get an answer. Agentic AI goes further. These systems can:</p>

<ul>
<li><strong>Decompose complex tasks</strong> into manageable steps</li>
<li><strong>Use external tools</strong> — search engines, code interpreters, APIs</li>
<li><strong>Maintain context</strong> across long interaction chains</li>
<li><strong>Self-correct</strong> by evaluating their own outputs</li>
<li><strong>Collaborate</strong> with other agents or humans in loops</li>
</ul>

<h2>The Developer's Perspective</h2>

<p>For developers, this changes everything. We're no longer just building applications that call an LLM. We're designing systems where AI agents are first-class participants in the software lifecycle — writing code, reviewing PRs, debugging issues, and even architecting solutions.</p>

<p>The key challenge isn't the AI's capability — it's designing the right guardrails, feedback loops, and human oversight mechanisms to make these agents reliable and trustworthy.</p>

<img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80" alt="Robot hand reaching out" />

<h2>Looking Forward</h2>

<p>The next few years will be defined by how well we learn to collaborate with these systems. The developers who thrive will be those who understand not just how to use AI, but how to <em>design with</em> AI as a partner.</p>

<blockquote>The best AI tools don't replace human judgment — they amplify it.</blockquote>

<p>I'll be diving deeper into specific agentic frameworks and patterns in upcoming posts. Stay tuned.</p>`,
    category: "blog",
    tags: "AI,Agents,Development",
    createdAt: "2026-03-28T00:00:00.000Z",
  },
  {
    id: cuid(),
    title: "Understanding Transformer Architecture: A Visual Guide",
    slug: "understanding-transformers",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    excerpt: "A clear, visual walkthrough of the transformer architecture — the foundation behind GPT, Claude, and every major LLM.",
    content: `<p>The transformer architecture, introduced in the landmark 2017 paper "Attention Is All You Need," has become the backbone of modern AI. Yet many developers use transformer-based models daily without fully understanding how they work under the hood.</p>

<h2>The Core Insight: Self-Attention</h2>

<p>At the heart of every transformer is the self-attention mechanism. Unlike previous architectures (RNNs, LSTMs) that processed sequences one token at a time, self-attention allows the model to look at <em>all</em> tokens simultaneously and learn which ones are most relevant to each other.</p>

<p>Think of it like reading a sentence where every word can directly "see" every other word, weighted by relevance. The word "it" in "The cat sat on the mat because it was tired" can directly attend to "cat" to resolve the reference.</p>

<h2>Key Components</h2>

<p>A transformer consists of:</p>

<ol>
<li><strong>Token embeddings</strong> — converting words to vectors</li>
<li><strong>Positional encodings</strong> — injecting sequence order information</li>
<li><strong>Multi-head attention layers</strong> — multiple parallel attention mechanisms</li>
<li><strong>Feed-forward networks</strong> — processing attended representations</li>
<li><strong>Layer normalization</strong> — stabilizing training</li>
</ol>

<h2>Why It Matters</h2>

<p>Understanding transformers isn't just academic. It helps you:</p>

<ul>
<li>Write better prompts by understanding how context windows work</li>
<li>Debug unexpected model behavior</li>
<li>Make informed decisions about model selection and fine-tuning</li>
<li>Build more effective RAG (Retrieval-Augmented Generation) pipelines</li>
</ul>

<img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=700&q=80" alt="Neural network visualization" />

<p>The transformer architecture is deceptively simple in concept but profound in its implications. It's worth taking the time to understand it deeply.</p>`,
    category: "blog",
    tags: "AI,Transformers,Deep Learning",
    createdAt: "2026-03-15T00:00:00.000Z",
  },
  {
    id: cuid(),
    title: "Building Reliable RAG Systems: Lessons from Production",
    slug: "reliable-rag-systems",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    excerpt: "Retrieval-Augmented Generation sounds simple in theory. In practice, building a reliable RAG pipeline requires careful attention to chunking, retrieval quality, and prompt design.",
    content: `<p>Retrieval-Augmented Generation (RAG) has become the default pattern for building AI applications that need to work with custom knowledge bases. The concept is straightforward: retrieve relevant documents, stuff them into context, and let the LLM generate an answer.</p>

<p>But after building several RAG systems in production, I've learned that the gap between a demo and a reliable system is significant.</p>

<h2>Lesson 1: Chunking Strategy Matters More Than You Think</h2>

<p>How you split your documents into chunks fundamentally affects retrieval quality. Too small, and you lose context. Too large, and you dilute relevance. I've found that semantic chunking — splitting at natural boundaries like paragraphs or sections — consistently outperforms fixed-size chunking.</p>

<h2>Lesson 2: Retrieval Quality Is Your Bottleneck</h2>

<p>The most powerful LLM in the world can't give good answers from bad context. Invest heavily in your retrieval pipeline: hybrid search (combining semantic and keyword), re-ranking, and query expansion all make meaningful differences.</p>

<h2>Lesson 3: Evaluation Is Non-Negotiable</h2>

<p>You need systematic evaluation of both retrieval quality (are you finding the right chunks?) and generation quality (is the answer faithful to the retrieved context?). Build evaluation datasets early and measure continuously.</p>

<h2>Lesson 4: Design for Graceful Failure</h2>

<p>Sometimes the answer isn't in your knowledge base. Your system should recognize this and say "I don't know" rather than hallucinate. This requires careful prompt engineering and confidence calibration.</p>

<blockquote>A RAG system that confidently gives wrong answers is worse than one that honestly says "I'm not sure."</blockquote>`,
    category: "blog",
    tags: "AI,RAG,Engineering",
    createdAt: "2026-03-05T00:00:00.000Z",
  },
  {
    id: cuid(),
    title: "On Reading in the Age of Infinite Content",
    slug: "reading-in-age-of-infinite-content",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    excerpt: "In a world drowning in content, the deliberate act of reading a book has become a quiet act of resistance.",
    content: `<p>I finished reading Italo Calvino's "If on a winter's night a traveler" last week, and it left me thinking about the very act of reading itself.</p>

<p>We live in an age of infinite content. Every day, more text is generated than any human could consume in a lifetime. AI can now produce coherent prose at superhuman speed. And yet, sitting with a book — a single, finite, carefully crafted book — feels more meaningful than ever.</p>

<h2>The Paradox of Abundance</h2>

<p>When content was scarce, reading was a practical necessity. Now that it's abundant, reading has become a choice — and choices reveal values. Choosing to spend three hours with a novel instead of scrolling through an infinite feed is a statement about what we believe deserves our attention.</p>

<h2>Slow Reading as Practice</h2>

<p>I've been experimenting with what I call "slow reading" — deliberately reading at a pace that allows for genuine absorption. No skimming. No speed reading. Just careful, attentive engagement with the text.</p>

<p>The results have been surprising. I remember more, think more deeply, and — paradoxically — feel like I've consumed <em>more</em> meaningful content despite reading fewer words.</p>

<h2>What Books Give Us That Feeds Can't</h2>

<p>A good book offers something no algorithmic feed can: a sustained argument, a complete arc, a mind engaging with yours over hundreds of pages. It demands patience and rewards it with depth.</p>

<blockquote>In the attention economy, the most radical thing you can do is pay attention — deeply, willingly, to one thing at a time.</blockquote>

<img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80" alt="Open book on a table" />

<p>I'm compiling a reading list for this year. More on that soon.</p>`,
    category: "diary",
    tags: "Reading,Literature,Reflection",
    createdAt: "2026-03-25T00:00:00.000Z",
  },
  {
    id: cuid(),
    title: "Morning Walks and the Clarity They Bring",
    slug: "morning-walks-clarity",
    coverImage: "https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80",
    excerpt: "A reflection on how the simple habit of morning walks has become my most productive thinking time.",
    content: `<p>For the past six months, I've started every day with a 30-minute walk. No phone. No podcasts. Just walking and thinking.</p>

<p>It started as a health habit, but it's become something else entirely — my most reliable source of clarity and creative insight.</p>

<h2>The Thinking Walk</h2>

<p>There's a long tradition of thinkers who walked. Nietzsche claimed all great thoughts are conceived while walking. Beethoven carried a notebook on his walks around Vienna. Darwin had his "thinking path" — a gravel track he paced daily.</p>

<p>I'm no Nietzsche, but I've found the pattern holds at a more modest scale. Something about the rhythm of walking, the changing scenery, the lack of screens — it creates a mental space that sitting at a desk simply doesn't.</p>

<h2>What I've Noticed</h2>

<p>Problems that seemed intractable at 11 PM often resolve themselves by 7 AM, somewhere between my front door and the park. The solutions don't arrive through force. They emerge when I stop trying so hard to find them.</p>

<p>I've also noticed that walking changes my relationship with time. A 30-minute walk feels generous and unhurried. Thirty minutes of scrolling feels like nothing. Same duration, completely different experience of time.</p>

<h2>A Simple Recommendation</h2>

<p>If you're stuck on a problem, close the laptop. Leave your phone behind. Walk for 20 minutes. Don't try to solve anything. Just walk.</p>

<p>You might be surprised by what your mind does when you give it space.</p>

<blockquote>The mind, like water, finds its level when you stop stirring.</blockquote>`,
    category: "diary",
    tags: "Reflection,Habits,Creativity",
    createdAt: "2026-03-12T00:00:00.000Z",
  },
  {
    id: cuid(),
    title: "Notes on Borges and the Infinite Library",
    slug: "borges-infinite-library",
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    excerpt: "Borges imagined a library containing every possible book. Now that we're building something eerily similar, his fiction reads like prophecy.",
    content: `<p>Jorge Luis Borges wrote "The Library of Babel" in 1941. In it, he imagined a universe-sized library containing every possible combination of characters — every book that could ever be written, including every truth, every falsehood, and every meaningless string of letters.</p>

<p>I re-read it last week, and it hit differently in 2026.</p>

<h2>The Library as Metaphor for the Internet</h2>

<p>Borges' librarians wander endlessly through hexagonal rooms, searching for meaningful books among the vast majority of gibberish. They develop theories, form cults, descend into despair. Some believe in a "Book-Man" — a person who has found the catalog of catalogs, the index that makes sense of everything.</p>

<p>Replace "hexagonal rooms" with "web pages" and "librarians" with "users" and the parallel writes itself. We, too, wander through an incomprehensible volume of information, searching for signal in noise, hoping that some algorithm — our own Book-Man — will surface what matters.</p>

<h2>Large Language Models as Librarians</h2>

<p>What strikes me most is that LLMs are essentially doing what Borges' librarians dreamed of: reading everything and synthesizing meaning. They've consumed the library and can, on demand, produce a coherent response to almost any query.</p>

<p>But Borges would remind us: the ability to generate coherent text is not the same as understanding. His library contains every true statement, but also its negation. The challenge was never generation — it was <em>discernment</em>.</p>

<h2>The Enduring Question</h2>

<p>Borges' story ultimately asks: in a world of infinite information, what is the value of meaning? It's a question that becomes more urgent with every advance in AI.</p>

<blockquote>"The Library is unlimited and cyclical. If an eternal traveler were to cross it in any direction, after centuries he would see that the same volumes were repeated in the same disorder." — Borges</blockquote>

<p>Some fiction doesn't predict the future so much as illuminate the present. Borges is that kind of writer.</p>`,
    category: "diary",
    tags: "Literature,Borges,AI",
    createdAt: "2026-02-28T00:00:00.000Z",
  },
];

const insert = db.prepare(`
  INSERT INTO Post (id, title, slug, excerpt, content, category, tags, coverImage, published, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
`);

const insertMany = db.transaction((posts) => {
  for (const p of posts) {
    insert.run(p.id, p.title, p.slug, p.excerpt, p.content, p.category, p.tags, p.coverImage || null, p.createdAt, p.createdAt);
  }
});

insertMany(posts);
console.log(`Seeded ${posts.length} posts successfully.`);
db.close();
