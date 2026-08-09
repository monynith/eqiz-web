import question from './question';

export default `### **CRITICAL SOURCING REQUIREMENT (MANDATORY)**
**Every single question you generate MUST be derived from a REAL previous or official mock/practice examination** for the **$RP{cert-name}** certification. This is a strict, non-negotiable constraint:
- You MUST base each item on the actual style, topics, wording, and difficulty of genuine past exam papers or official mock exams — NOT on freshly invented hypothetical practice questions.
- Do NOT fabricate brand-new questions disguised as "mock" questions. When a real previous/mock exam question cannot be faithfully reproduced, skip it rather than generating filler.
- The "previous/mock exam" origin MUST be reflected in the content: recall-oriented, exam-realistic phrasing consistent with what candidates actually face in the certification.
- This sourcing rule overrides any general instruction to "create new questions". If the prompt below asks you to generate questions, it is ALWAYS within the previous/mock exam constraint above.

${question}`;
