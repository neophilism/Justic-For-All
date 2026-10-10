import type { InitiativeStatus } from "@jfa/contracts";

export type Initiative = Readonly<{ slug: string; name: string; description: string; status: InitiativeStatus }>;

export const initiatives: readonly Initiative[] = Object.freeze([
  {slug:"injustice-project",name:"The Injustice Project / Injustice Archive",description:"A dedicated future platform for voluntary testimony and publication controls.",status:"planning"},
  {slug:"public-record",name:"The Public Record",description:"A future public-facing platform for coordinated, independent public-record requests.",status:"planning"},
  {slug:"liberty-nodes",name:"Liberty Nodes",description:"Distributed publication and independent verification of approved public records.",status:"planning"},
  {slug:"justice-teams",name:"Justice Teams",description:"Consent-based future volunteer assistance and case coordination.",status:"planning"},
  {slug:"witness-corps",name:"Witness Corps",description:"Responsible civic observation and incident documentation.",status:"planning"},
  {slug:"one-question",name:"One Question",description:"Track questions posed to public officials and their published responses.",status:"planning"},
  {slug:"justice-works",name:"Justice Works",description:"Voluntary creative work connected to documented accounts.",status:"planning"},
  {slug:"public-witness",name:"Public Witness",description:"Information about peaceful public participation.",status:"planning"},
  {slug:"human-firewall",name:"Human Firewall / Consent Strike",description:"Educational resources about voluntary data-sharing decisions.",status:"planning"},
  {slug:"surveillance-enabler-boycott",name:"Surveillance-Enabler Boycott",description:"Information on lawful, voluntary consumer decisions.",status:"planning"}
]);

/** Returns a published public registry entry; never reveals internal connector metadata. */
export function findPublicInitiative(slug: string): Initiative | undefined {
  return initiatives.find((item) => item.slug === slug);
}
