export default function CategoryTabs({ categories, selected, onChange }) {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category}
          className={selected === category ? "category active" : "category"}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
