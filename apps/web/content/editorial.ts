/**
 * Git-reviewed public copy, compiled into server-rendered pages.
 * This is a temporary editorial source. JFA-13 will introduce an authorized CMS
 * without changing the public disclosure rules.
 */
export const editorialRevision = "JFA-11-2026-10-10";
export const homeCopy = {
  eyebrow: "Know your rights. Make the record visible.",
  heading: "Justice belongs to everyone.",
  summary: "Justice For All is a civic initiative for people confronting injustice, people trying to understand their rights, and people who want to help others. Everyone should be able to find clear information and a way forward.",
  statusHeading: "What is available now?",
  statusText: "This website is an early public information service. Confidential testimony intake, case assistance, public-records participation, and volunteer registration have not been activated on this site."
} as const;

export const journeyCopy = [
  {
    id: "share-experience",
    title: "Understand how to share an experience",
    description: "Learn how testimony, identity protection, permission to publish, and independent verification will work before choosing whether to disclose anything.",
    href: "/stories",
    action: "Learn about sharing your story"
  },
  {
    id: "examine-records",
    title: "Explore public records",
    description: "Learn how the public-records initiative will connect requests, source documents, and evidence. The integrated records search is not yet available.",
    href: "/records",
    action: "Explore the records program"
  },
  {
    id: "make-a-difference",
    title: "Find a way to help",
    description: "Whether you offer research, accessibility support, legal experience, journalism, art, or simply a willingness to learn, there is more than one way to participate.",
    href: "/get-involved",
    action: "Learn about participation"
  }
] as const;
