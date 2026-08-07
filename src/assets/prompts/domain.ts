export default `
const notes = [
    {
        "id": "A",
        "part": "Foundations of Professionalism and the Code of Professional Conduct"
    },
    {
        "id": "B",
        "part": "Ethical Frameworks and Moral Decision-Making in Financial Services"
    },
    {
        "id": "C",
        "part": "Fiduciary Duty, Customer Protection, and the Banker-Customer Relationship"
    },
    {
        "id": "D",
        "part": "Corporate Governance, ESG, and the Social Responsibility of Banking"
    }
];

Do the same for:
$RP{app-name} on $RP{cert-name}

- Provide in JSON format, not in js.
- Only mention the main name for each domain, no need colon to explain more. 
- Make sure domain has only 4. No need to mention Part A, B, ... in part field
- JSON structure of id and part need to be same as the example above.
- Domain must be strictly from its examination and certificate.
`