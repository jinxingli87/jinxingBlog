---
title: "Prompt Engineering: 5 Patterns That Actually Work"
date: 2026-04-01
excerpt: "After months of working with LLMs daily, these are the prompt patterns I keep coming back to."
tags: [AI, Prompting, Productivity]
coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
---

After months of working with LLMs daily — for coding, writing, analysis, and brainstorming — I've settled on a handful of prompt patterns that consistently produce better results.

## 1. The Role Pattern

Start by telling the model *who* it is. This isn't just fluff — it primes the model to draw on relevant knowledge patterns.

**Instead of:** "Write a code review for this function"

**Try:** "You are a senior software engineer conducting a thorough code review. Focus on correctness, performance, and maintainability."

## 2. The Chain-of-Thought Nudge

For complex reasoning, explicitly ask the model to think step by step. This simple addition dramatically improves accuracy on multi-step problems.

> "Think through this step by step before giving your final answer."

## 3. The Few-Shot Setup

Show the model what you want by example. One or two examples of input → output are worth more than paragraphs of description.

## 4. The Constraint Frame

Tell the model what *not* to do. Constraints are surprisingly effective:

- "Do not use any external libraries"
- "Keep the response under 200 words"
- "Do not explain what the code does — just write it"

## 5. The Iterative Refinement Loop

Don't try to get the perfect output in one shot. Start broad, then narrow:

1. Generate a first draft
2. Critique it yourself
3. Ask the model to improve specific aspects
4. Repeat

![AI thinking process](https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=700&q=80)

The best prompt engineers aren't those who write the cleverest single prompts — they're the ones who build effective **conversations** with the model.
