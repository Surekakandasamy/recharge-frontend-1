import PlanCard from "./PlanCard";

export default function PlansGrid({ plans, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map(p => (
        <PlanCard key={p.id} plan={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
