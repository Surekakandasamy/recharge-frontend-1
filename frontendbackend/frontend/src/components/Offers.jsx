export default function Offers({ offers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {offers.map((o, i) => (
        <div key={i} className="border rounded p-4 flex gap-3">
          <span className="text-3xl">{o.icon}</span>
          <div>
            <p className="font-bold">{o.title}</p>
            <p className="text-sm text-gray-600">{o.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
