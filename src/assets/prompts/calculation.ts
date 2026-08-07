export default `
You are an expert on professional certification exams.

App: $RP{app-name}
Certification: $RP{cert-name}

Determine whether the $RP{cert-name} certification exam (delivered under the $RP{app-name} app) includes FINANCIAL or MATHEMATICAL CALCULATION questions — i.e. questions that require a candidate to perform arithmetic, solve equations, or apply financial/math formulas. Examples include (but are not limited to): interest (simple/compound), present/future value and time value of money, ratios, percentages and growth rates, weighted averages, net present value (NPV), internal rate of return (IRR), currency/unit conversions, depreciation, and other numerical computations a candidate must calculate to answer.

Do NOT count questions that merely ask the candidate to interpret a chart, read a figure, or recall a definition as "calculation" — only count questions where the candidate must actually compute a value.

Respond strictly in the following format:

HAS_CALCULATION: Yes or No

SUMMARY:
- Briefly explain whether financial or mathematical calculation questions appear in this exam.
- If yes, list the typical calculation topics/formulas a candidate must know. Give 2-4 short, concrete examples of the kind of calculation asked (e.g. "compute the future value of an investment at X% over N years").
- If no, state what question styles are used instead (e.g. conceptual, definitional, multiple-choice scenario).

Keep it concise and factual. Do not invent specifics you are not confident about; if uncertain, say so explicitly.
`;
