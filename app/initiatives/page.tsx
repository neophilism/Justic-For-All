import { initiatives } from "../../lib/initiatives";

export default function Initiatives() {
  return <div className="wrap"><h1>Initiatives</h1><p className="lede">These initiatives are at the planning stage. None of the linked tools is presented as operational.</p><ul className="initiative-list">{initiatives.map((item) => <li key={item.slug}><h2>{item.name}</h2><p>{item.description}</p><span className="status">Planning</span></li>)}</ul></div>;
}
