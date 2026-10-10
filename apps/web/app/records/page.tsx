import Link from "next/link";

export const metadata = {
  title: "Public Records — Justice For All",
  description: "Information about the planned Public Record civic participation initiative."
};

export default function RecordsInformation() {
  return (
    <article className="wrap public-article">
      <p className="eyebrow">The Public Record — information</p>
      <h1>Public records help people ask better questions.</h1>
      <p className="lede">The Public Record is a planned participatory program for public-record requests and the publication of government responses, supported by independently sourced archives.</p>
      <section aria-labelledby="distinction">
        <h2 id="distinction">Requests and archives are different</h2>
        <p>The Public Record will guide individuals through records-request participation. The separate FOIA Aggregator collects and indexes records that have already been released. These are distinct services, with their own sources and availability.</p>
        <p>Whenever records are presented, the source, document date, retrieval status, and limits of completeness should be visible.</p>
      </section>
      <section aria-labelledby="availability">
        <h2 id="availability">Integration is not active here</h2>
        <p>The request workflow and integrated document search have not been activated on this site. There is no request-submission form on this page.</p>
        <p><Link href="/initiatives">Explore the planned initiatives</Link>.</p>
      </section>
    </article>
  );
}
