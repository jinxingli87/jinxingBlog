-- Run this in your Supabase SQL Editor to create the tables

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  image text,
  password text,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text default '',
  content text not null,
  category text not null,
  tags text default '',
  cover_image text,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_category on posts(category);
create index if not exists idx_comments_post_id on comments(post_id);

-- Seed data: sample blog posts
insert into posts (title, slug, excerpt, content, category, tags, cover_image, created_at) values
(
  'The Rise of Agentic AI: What It Means for Developers',
  'rise-of-agentic-ai',
  'Agentic AI systems are shifting from passive tools to autonomous collaborators. Here''s what every developer should understand about this paradigm shift.',
  '<p>We''re witnessing a fundamental shift in how AI systems operate. The era of simple prompt-response interactions is giving way to something far more powerful: agentic AI — systems that can plan, reason, use tools, and take autonomous action toward goals.</p><h2>What Makes AI "Agentic"?</h2><p>Traditional AI models respond to prompts. You ask a question, you get an answer. Agentic AI goes further. These systems can:</p><ul><li><strong>Decompose complex tasks</strong> into manageable steps</li><li><strong>Use external tools</strong> — search engines, code interpreters, APIs</li><li><strong>Maintain context</strong> across long interaction chains</li><li><strong>Self-correct</strong> by evaluating their own outputs</li><li><strong>Collaborate</strong> with other agents or humans in loops</li></ul><h2>The Developer''s Perspective</h2><p>For developers, this changes everything. We''re no longer just building applications that call an LLM. We''re designing systems where AI agents are first-class participants in the software lifecycle — writing code, reviewing PRs, debugging issues, and even architecting solutions.</p><p>The key challenge isn''t the AI''s capability — it''s designing the right guardrails, feedback loops, and human oversight mechanisms to make these agents reliable and trustworthy.</p><img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&q=80" alt="Robot hand reaching out" /><h2>Looking Forward</h2><p>The next few years will be defined by how well we learn to collaborate with these systems. The developers who thrive will be those who understand not just how to use AI, but how to <em>design with</em> AI as a partner.</p><blockquote>The best AI tools don''t replace human judgment — they amplify it.</blockquote><p>I''ll be diving deeper into specific agentic frameworks and patterns in upcoming posts. Stay tuned.</p>',
  'blog', 'AI,Agents,Development',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  '2026-03-28'
),
(
  'Understanding Transformer Architecture: A Visual Guide',
  'understanding-transformers',
  'A clear, visual walkthrough of the transformer architecture — the foundation behind GPT, Claude, and every major LLM.',
  '<p>The transformer architecture, introduced in the landmark 2017 paper "Attention Is All You Need," has become the backbone of modern AI.</p><h2>The Core Insight: Self-Attention</h2><p>At the heart of every transformer is the self-attention mechanism. Unlike previous architectures that processed sequences one token at a time, self-attention allows the model to look at <em>all</em> tokens simultaneously and learn which ones are most relevant to each other.</p><h2>Key Components</h2><ol><li><strong>Token embeddings</strong> — converting words to vectors</li><li><strong>Positional encodings</strong> — injecting sequence order</li><li><strong>Multi-head attention layers</strong> — parallel attention mechanisms</li><li><strong>Feed-forward networks</strong> — processing representations</li><li><strong>Layer normalization</strong> — stabilizing training</li></ol><h2>Why It Matters</h2><p>Understanding transformers helps you write better prompts, debug model behavior, and build more effective RAG pipelines.</p><img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=700&q=80" alt="Neural network visualization" /><p>The transformer architecture is deceptively simple in concept but profound in its implications.</p>',
  'blog', 'AI,Transformers,Deep Learning',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  '2026-03-15'
),
(
  'Building Reliable RAG Systems: Lessons from Production',
  'reliable-rag-systems',
  'Retrieval-Augmented Generation sounds simple in theory. In practice, building a reliable RAG pipeline requires careful attention to chunking, retrieval quality, and prompt design.',
  '<p>RAG has become the default pattern for building AI applications with custom knowledge bases.</p><h2>Lesson 1: Chunking Strategy Matters</h2><p>How you split documents into chunks fundamentally affects retrieval quality. Semantic chunking — splitting at natural boundaries — consistently outperforms fixed-size chunking.</p><h2>Lesson 2: Retrieval Quality Is Your Bottleneck</h2><p>Invest heavily in your retrieval pipeline: hybrid search, re-ranking, and query expansion all make meaningful differences.</p><h2>Lesson 3: Evaluation Is Non-Negotiable</h2><p>Build evaluation datasets early and measure continuously.</p><h2>Lesson 4: Design for Graceful Failure</h2><p>Your system should say "I don''t know" rather than hallucinate.</p><blockquote>A RAG system that confidently gives wrong answers is worse than one that honestly says "I''m not sure."</blockquote>',
  'blog', 'AI,RAG,Engineering',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  '2026-03-05'
),
(
  'On Reading in the Age of Infinite Content',
  'reading-in-age-of-infinite-content',
  'In a world drowning in content, the deliberate act of reading a book has become a quiet act of resistance.',
  '<p>We live in an age of infinite content. And yet, sitting with a book feels more meaningful than ever.</p><h2>The Paradox of Abundance</h2><p>When content was scarce, reading was a necessity. Now it''s a choice — and choices reveal values.</p><h2>Slow Reading as Practice</h2><p>I''ve been experimenting with "slow reading" — deliberately reading at a pace that allows for genuine absorption. I remember more and think more deeply.</p><h2>What Books Give Us That Feeds Can''t</h2><p>A good book offers a sustained argument, a complete arc, a mind engaging with yours over hundreds of pages.</p><blockquote>In the attention economy, the most radical thing you can do is pay attention — deeply, willingly, to one thing at a time.</blockquote><img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80" alt="Open book on a table" />',
  'diary', 'Reading,Literature,Reflection',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
  '2026-03-25'
),
(
  'Morning Walks and the Clarity They Bring',
  'morning-walks-clarity',
  'A reflection on how the simple habit of morning walks has become my most productive thinking time.',
  '<p>For the past six months, I''ve started every day with a 30-minute walk. No phone. No podcasts. Just walking and thinking.</p><h2>The Thinking Walk</h2><p>There''s a long tradition of thinkers who walked. Something about the rhythm of walking creates a mental space that sitting at a desk doesn''t.</p><h2>What I''ve Noticed</h2><p>Problems that seemed intractable at 11 PM often resolve themselves by 7 AM during a walk. Walking also changes my relationship with time — 30 minutes feels generous and unhurried.</p><h2>A Simple Recommendation</h2><p>If you''re stuck on a problem, close the laptop. Leave your phone behind. Walk for 20 minutes.</p><blockquote>The mind, like water, finds its level when you stop stirring.</blockquote>',
  'diary', 'Reflection,Habits,Creativity',
  'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&q=80',
  '2026-03-12'
),
(
  'Notes on Borges and the Infinite Library',
  'borges-infinite-library',
  'Borges imagined a library containing every possible book. Now that we''re building something eerily similar, his fiction reads like prophecy.',
  '<p>Borges wrote "The Library of Babel" in 1941 — a universe-sized library containing every possible book. I re-read it last week, and it hit differently in 2026.</p><h2>The Library as Metaphor for the Internet</h2><p>Replace "hexagonal rooms" with "web pages" and the parallel writes itself.</p><h2>Large Language Models as Librarians</h2><p>LLMs are doing what Borges'' librarians dreamed of: reading everything and synthesizing meaning. But Borges would remind us: generation is not the same as <em>discernment</em>.</p><h2>The Enduring Question</h2><p>In a world of infinite information, what is the value of meaning?</p><blockquote>"The Library is unlimited and cyclical." — Borges</blockquote><p>Some fiction doesn''t predict the future so much as illuminate the present.</p>',
  'diary', 'Literature,Borges,AI',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
  '2026-02-28'
);
