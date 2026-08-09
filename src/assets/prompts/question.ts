export default `
### **Logic & Generation Protocol (Absolute Distribution Guard)**
**N = 1**  
**Standard Field String:** "$RP{domain-name}"
**Core Objective:** Generate a batch of 100 high-quality, professionally authored, examination-grade questions for the **$RP{app-name}** on **$RP{cert-name}** exam based on a user-provided ID range (**N to N+99**). Output must be a single, continuous, raw JSON code block containing 100 completely fresh and fully unique conceptual, regulatory, or operational test entries with zero structural or verbatim duplication. Every item MUST meet the professional quality and editorial standards defined in Section 0 below.
To maintain strict technical rigor, **do not write narrative scenario questions.** Strictly prohibit hypothetical characters, specific personas, or descriptive operational scenarios (e.g., avoid preambles like *"An organization notices..."*, *"A contractor evaluates..."*, *"During a strategic review, an auditor looks at..."*). Every question must be phrased as a direct, standalone conceptual or definition-based question.



#### **0. Professional Quality & Editorial Standards (Mandatory)**

Every question MUST meet the standard of a professionally authored, examination-grade item suitable for an accredited certification body. This is not optional stylistic guidance — it is a hard acceptance criterion evaluated before output:

- **Authoritative Accuracy:** Questions must reflect current, widely accepted industry knowledge and the official body of knowledge / syllabus terminology for the **$RP{cert-name}** exam. Never introduce speculative, outdated, deprecated, or region-specific assumptions unless the domain explicitly requires them.
- **Precision & Clarity:** Use unambiguous, grammatically correct, and carefully proofread language. Eliminate colloquialisms, filler words, vague phrasing, and double negatives. Each question must test exactly one clearly defined concept or competency.
- **Professional Distractors:** Every answer choice must be plausible, mutually exclusive, grammatically parallel, and written at the same level of detail and professionalism. Distractors must represent common misconceptions or near-correct statements — never obvious nonsense, and never duplicates of the correct answer merely reworded.
- **Substantive Explanations:** The \`explanation\` must be a concise, professional rationale that states *why* the correct answer is right and, where useful, *why* each distractor is wrong, grounded in the underlying principle, standard, or regulatory rule.
- **Consistent Editorial Tone:** Maintain a formal, neutral, examination tone throughout the entire batch. The 100 items must read as a cohesive, coherent examination set — not a collection of loosely related fragments.

#### **1. Formatting & Structure**

- **JSON Schema:** Strictly \`{"data": []}\`. Fields: \`id\`, \`standard\`, \`question\`, \`answer-1\`, \`answer-2\`, \`answer-3\`, \`answer-4\`, \`correct\`, \`explanation\`. No duplicate keys are allowed within an object block.
- **Standard Field:** Must strictly match the standard string provided by the user for every entry.
- **Zero-Digit Answer Policy:** Prohibit any answer choice from being a string of digits (e.g., "1, 2") or comma-separated numbers. Every choice must be a unique, descriptive text string. This applies identically to single-selection AND multi-selection questions — see Section 2A below for how multi-selection questions must be structured to comply.
- **Text Formatting:**
    - Use \`\n\` inside the \`question\` field only when breaking up lines formally.
    - Strictly **zero** \`\n\` in \`answer-x\` or \`explanation\` fields.
    - **Strict Prohibition on LaTeX/MathJax:** Do not use any LaTeX or MathJax symbols (e.g., \`$\`, \`$$\`, \`(\`, \`)\`, \`frac\`, \`sigma\`, \`sqrt\`, \`sum\`) in **any** field. All mathematical relationships must be described in plain English or standard keyboard characters (e.g., use "beta" not the symbol, "sum of squares" not the symbol, "square root" not the symbol).
- **No mention of answers in question field.**



#### **2. Mandatory Sequential Distribution Matrix**
The output **MUST** strictly transition its internal schema architecture at the exact relative ID boundaries defined below. The transition from single to multiple combinations must scale upward precisely:

| Block | Relative ID Range | Question Type | Correct Field Format Requirement | Absolute Count |
|-------|------------------|---------------|--------------------------------|----------------|
| **1** | **N to N+79** | Single Selection | Exactly **1** number digit (e.g., \`"1"\`) | **80 Questions** |
| **2** | **N+80 to N+89** | Multiple Selection (2) | Exactly **2** comma-separated digits (e.g., \`"1,2"\`) | **10 Questions** |
| **3** | **N+90 to N+97** | Multiple Selection (3) | Exactly **3** comma-separated digits (e.g., \`"1,2,3"\`) | **8 Questions** |
| **4** | **N+98 to N+99** | Multiple Selection (4) | Exactly **4** comma-separated digits (\`"1,2,3,4"\`) | **2 Questions** |

**Important distinction:** the comma-separated digit format above applies ONLY to the \`correct\` field, which is metadata identifying which answer-x fields are right. It never applies to \`answer-1\` through \`answer-4\` themselves, in any block. See Section 2A.

#### **2A. Mandatory Structure for Multi-Selection Questions (Blocks 2, 3, 4)**

This is a hard structural rule, not a style preference. For every multi-selection question:

- **The question stem must NOT enumerate numbered sub-statements** (i.e., do not write "1. ... 2. ... 3. ... 4. ..." inside the \`question\` field for a multi-select item). The question must be a single, direct interrogative sentence, exactly as required for single-selection questions in Section 4.
- **Each of \`answer-1\` through \`answer-4\` must be one complete, standalone, descriptive statement** — a full candidate answer in its own right, not a fragment or a reference back to a numbered list in the question.
- **The \`correct\` field is pure metadata**, listing which of \`answer-1\`–\`answer-4\` are correct (e.g., \`"1,3"\` means answer-1 and answer-3 are both correct). It is never rendered as an answer choice itself and must never appear as the *content* of any \`answer-x\` field.
- **Prohibited pattern (do not produce this):** a question listing four numbered statements, with \`answer-1\` through \`answer-4\` each being a digit-combination like \`"1,2"\`, \`"2,3"\`, \`"3,4"\`, \`"1,4"\` referencing those statements. This is a disguised violation of the Zero-Digit Answer Policy and is strictly forbidden even though the characters are technically inside a text string.
- Distractors for multi-select questions should be plausible, individually complete statements that a test-taker could mistake for correct — not partial fragments designed to be combined.



#### **3. Absolute Execution Guard for Block 4 (Items N+98 and N+99)**

To prevent pattern fatigue from dropping the final block requirements, you must strictly follow this structural design shift for the last two entries:

- **Factual Scope:** The question text must evaluate holistic industry systems, comprehensive regulatory frameworks, or multi-tiered corporate parameters where all 4 listed attributes are fundamentally true, valid, and interconnected components.
- **Format Sync:** Options \`answer-1\`, \`answer-2\`, \`answer-3\`, and \`answer-4\` must each be a distinct, accurate, standalone factual statement (per Section 2A — never a digit combination). The \`correct\` field for items **N+98** and **N+99** must read exactly \`"1,2,3,4"\` with zero structural variance or exception.



#### **4. Content & Quality Guardrails**
- **Direct Phrasing Style:** Construct questions exclusively using direct interrogatives or completion syntax.
    *Correct Pattern:* "What is the primary function of...?" or "Which regulatory standard defines...?"
    *Incorrect Pattern:* "An analyst is reviewing corporate statements and wants to determine..."

- **Professional & Authoritative Voice:** Write every field with the precision and formality of a certified examination. Use correct domain terminology, avoid slang or informal phrasing, and ensure there are no grammatical, spelling, or punctuation errors in any field.

- **Anti-Copy Safeguard:** Absolutely zero copy-pasting or minimal text alterations from previous sets. Every problem, option array, and context must evaluate distinct factual configurations, structural laws, and industry frameworks.

- **Clean Questions:** Strictly prohibit any variable text fragments, repetitive template suffixes, or serial identifiers from all fields. Every question must be rendered explicitly with independent vocabulary and diverse distractors.

- **Hint Removal:** Strictly remove words indicating the number of correct choices (e.g., "two," "three," "four," "select," "multiple") from the question text.

- **Unique Options:** Eliminate "All of the above," "None of the above," or numbered combinations (e.g., "1 and 2 only", "1,2", "3,4"). This applies to every \`answer-x\` field in every block without exception — see Section 2A for the required alternative structure in multi-select blocks.

- **Explanations (High-Context & Professional):** Provide a precise, professional rationale explaining the underlying business logic, regulatory rule, or technical principle. Do not use option labels (e.g., avoid "Option 1 is correct..."). Reference the authoritative standard or concept where applicable. **Do not use LaTeX or MathJax in explanations.**

$RP{comment-start}
- **Calculation Question Rule:**
    **$RP{cert-name} exam contains calculation-based questions.** Therefore, you **MUST** include calculation questions throughout the 100-question batch.

    For calculation questions:
    - Use \`\n\` inside the \`question\` field to format multi-step problems for readability.
    - Use standard keyboard characters and spell out mathematical operations (e.g., "divided by" instead of \`/\`, "multiplied by" instead of \`*\`, "sum" instead of \`\sum\`, "minus" instead of \`-\`).
    - Clearly present required data, formulas, or steps using \`\n\` line breaks.
    - Maintain all other formatting restrictions (no \`\n\` in answers or explanation).
    - Ensure the question tests both conceptual understanding and numerical application of double-entry mechanics (e.g., payroll calculations, non-current asset disposals, year-end adjustments, journal entry calculations).
    - Include a balanced mix of conceptual and calculation questions across all blocks.

    **CRITICAL: Numeric Answer Format for Calculation Questions**
    For calculation-based questions, the answer choices (\`answer-1\`, \`answer-2\`, \`answer-3\`, \`answer-4\`) **MUST** be formatted as numeric values with thousands separators (e.g., \`135,000\`), **NOT** written out in words (e.g., do not use "one hundred and thirty-five thousand pounds").
    - Use comma separators for thousands (e.g., \`135,000\`, \`1,000,000\`).
    - Do not include descriptive text (e.g., "pounds", "dollars") in the answer choices.
    - This ensures clarity, consistency, and proper parsing of calculation answers.
$RP{comment-end}


#### **5. Strict Prohibitions**
- **No mention of:** "Phnom Penh", "Cambodia", "2026", "NoDB", or "Eqiz".
- **No LaTeX or MathJax:** Absolutely no instances of \`$\`, \`$$\`, \`(\`, \`)\`, backslash-prefixed commands, or any mathematical markup commands in \`question\`, \`answer-x\`, or \`explanation\`.
- **No Truncation:** Provide the full 100 questions in one continuous code block. No partial or sample lists.
- **No digit-combination strings anywhere in \`answer-1\` through \`answer-4\`, in any block** — this includes patterns like \`"1,2"\`, \`"2, 3"\`, \`"1 and 4"\`. These strings are only ever valid inside the \`correct\` field.

#### **6. Programmatic Final Count Verification**
Before writing the data block, execute a final internal verification count of the \`correct\` metadata structure to confirm mathematical compliance:

- Is the count of single-digit strings (\`"x"\`) exactly **80**?
- Is the count of two-digit strings (\`"x,y"\`) exactly **10**?
- Is the count of three-digit strings (\`"x,y,z"\`) exactly **8**?
- Is the count of four-digit strings (\`"1,2,3,4"\`) exactly **2**?
- **Additionally: scan every \`answer-1\` through \`answer-4\` field across all 100 entries and confirm none of them contain a digit-only or comma-separated-digit string.** If any are found, rewrite those entries so each answer-x is a full descriptive statement per Section 2A.

*If Block 4 contains any single-selection parameters, fails to output items N+98 and N+99 with precisely four correct indicators, or contains any answer-x field with a digit-combination string, discard the tail buffer array and rewrite the final block elements to ensure perfect architectural compliance.*
`;