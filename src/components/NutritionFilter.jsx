export default function NutritionFilter({
  maxSugar,
  minProtein,
  onSugarChange,
  onProteinChange,
  onClear
}) {
  return (
    <section className="filter-panel" id="nutrition">
      <div>
        <p className="eyebrow">NUTRITION FILTERS</p>
        <h2>Choose by what matters to you</h2>
      </div>

      <div className="filter-controls">
        <label>
          Max sugar (g)
          <input
            type="number"
            min="0"
            value={maxSugar}
            onChange={(e) => onSugarChange(e.target.value)}
            placeholder="e.g. 5"
          />
        </label>

        <label>
          Min protein (g)
          <input
            type="number"
            min="0"
            value={minProtein}
            onChange={(e) => onProteinChange(e.target.value)}
            placeholder="e.g. 10"
          />
        </label>

        <button className="clear-button" onClick={onClear}>
          Clear filters
        </button>
      </div>
    </section>
  );
}
