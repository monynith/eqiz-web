export default `
### **Logic & Generation Protocol (Absolute Distribution Guard)**
**N = 1**  
**Standard Field String:** "$RP{domain-name}"
**Core Objective:** Generate a batch of 100 high-quality questions for the **$RP{app-name}** on **$RP{cert-name}** exam based on a user-provided ID range (**N to N+99**). Output must be a single, continuous, raw JSON code block containing 100 completely fresh and fully unique conceptual, regulatory, or operational test entries with zero structural or verbatim duplication.
To maintain strict technical rigor, **do not write narrative scenario questions.** Strictly prohibit hypothetical characters, specific personas, or descriptive operational scenarios (e.g., avoid preambles like *"An organization notices..."*, *"A contractor evaluates..."*, *"During a strategic review, an auditor looks at..."*). Every question must be phrased as a direct, standalone conceptual or definition-based question.



#### **1. Formatting & Structure**

- **JSON Schema:** Strictly \`{"data": []}\`. Fields: \`id\`, \`standard\`, \`question\`, \`answer-1\`, \`answer-2\`, \`answer-3\`, \`answer-4\`, \`correct\`, \`explanation\`. No duplicate keys are allowed within an object block.
- **Standard Field:** Must strictly match the standard string provided by the user for every entry.
- **Zero-Digit Answer Policy:** Prohibit any answer choice from being a string of digits (e.g., "1, 2") or comma-separated numbers. Every choice must be a unique, descriptive text string.
- **Text Formatting:**
    - Use \`\n\` inside the \`question\` field only when breaking up lines formally.
    - Strictly **zero** \`\n\` in \`answer-x\` or \`explanation\` fields.
    - **Strict Prohibition on LaTeX/MathJax:** Do not use any LaTeX or MathJax symbols (e.g., \`$\`, \`$$\`, \`\(\`, \`\)\`, \`\frac\`, \`\sigma\`, \`\sqrt\`, \`\sum\`) in **any** field. All mathematical relationships must be described in plain English or standard keyboard characters (e.g., use "beta" not \`\beta\`, "sum of squares" not \`\sum\`, "square root" not \`\sqrt\`).
- **No mention of answers in question field.**



#### **2. Mandatory Sequential Distribution Matrix**
The output **MUST** strictly transition its internal schema architecture at the exact relative ID boundaries defined below. The transition from single to multiple combinations must scale upward precisely:
| Block | Relative ID Range | Question Type | Correct Field Format Requirement | Absolute Count |

|-------|------------------|---------------|--------------------------------|----------------|

| **1** | **N to N+79** | Single Selection | Exactly **1** number digit (e.g., \`"1"\`) | **80 Questions** |

| **2** | **N+80 to N+89** | Multiple Selection (2) | Exactly **2** comma-separated digits (e.g., \`"1,2"\`) | **10 Questions** |

| **3** | **N+90 to N+97** | Multiple Selection (3) | Exactly **3** comma-separated digits (e.g., \`"1,2,3"\`) | **8 Questions** |

| **4** | **N+98 to N+99** | Multiple Selection (4) | Exactly **4** comma-separated digits (\`"1,2,3,4"\`) | **2 Questions** |



#### **3. Absolute Execution Guard for Block 4 (Items N+98 and N+99)**

To prevent pattern fatigue from dropping the final block requirements, you must strictly follow this structural design shift for the last two entries:

- **Factual Scope:** The question text must evaluate holistic industry systems, comprehensive regulatory frameworks, or multi-tiered corporate parameters where all 4 listed attributes are fundamentally true, valid, and interconnected components.
- **Format Sync:** Options \`answer-1\`, \`answer-2\`, \`answer-3\`, and \`answer-4\` must serve as distinct, accurate factual pillars. The \`correct\` field for items **N+98** and **N+99** must read exactly \`"1,2,3,4"\` with zero structural variance or exception.



#### **4. Content & Quality Guardrails**
- **Direct Phrasing Style:** Construct questions exclusively using direct interrogatives or completion syntax.
    *Correct Pattern:* "What is the primary function of...?" or "Which regulatory standard defines...?"
    *Incorrect Pattern:* "An analyst is reviewing corporate statements and wants to determine..."

- **Anti-Copy Safeguard:** Absolutely zero copy-pasting or minimal text alterations from previous sets. Every problem, option array, and context must evaluate distinct factual configurations, structural laws, and industry frameworks.
- **Clean Questions:** Strictly prohibit any variable text fragments, repetitive template suffixes, or serial identifiers from all fields. Every question must be rendered explicitly with independent vocabulary and diverse distractors.
- **Hint Removal:** Strictly remove words indicating the number of correct choices (e.g., "two," "three," "four," "select," "multiple") from the question text.
- **Unique Options:** Eliminate "All of the above," "None of the above," or numbered combinations (e.g., "1 and 2 only").
- **Explanations:** Provide high-context detail explaining the business logic or regulatory rule. Do not use option labels (e.g., avoid "Option 1 is correct..."). **Do not use LaTeX or MathJax in explanations.**


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
- **No LaTeX or MathJax:** Absolutely no instances of \`$\`, \`$$\`, \`\(\`, \`\)\`, \`\begin\`, \`\frac\`, or any backslash-prefixed mathematical commands in \`question\`, \`answer-x\`, or \`explanation\`.
- **No Truncation:** Provide the full 100 questions in one continuous code block. No partial or sample lists.

#### **6. Programmatic Final Count Verification**
Before writing the data block, execute a final internal verification count of the \`correct\` metadata structure to confirm mathematical compliance:

- Is the count of single-digit strings (\`"x"\`) exactly **80**?
- Is the count of two-digit strings (\`"x,y"\`) exactly **10**?
- Is the count of three-digit strings (\`"x,y,z"\`) exactly **8**?
- Is the count of four-digit strings (\`"1,2,3,4"\`) exactly **2**?

*If Block 4 contains any single-selection parameters or fails to output items N+98 and N+99 with precisely four correct indicators, discard the tail buffer array and rewrite the final block elements to ensure perfect architectural compliance.*

`