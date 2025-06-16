export default function LayerPanel({ items }: { items: any[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Layers</h3>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>Layer {index + 1}</li>
        ))}
      </ul>
    </div>
  );
}
