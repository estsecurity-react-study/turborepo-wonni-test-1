const Legend = ({ data, selectedItems, onChange }) => (
  <div className="legendContainer">
    {data.map((d) => (
      <div style={{ color: d.color }} key={d.name}>
        <label>
          {d.name !== 'Portfolio' && (
            <input
              type="checkbox"
              checked={selectedItems.includes(d.name)}
              onChange={() => onChange(d.name)}
            />
          )}
          {d.name}
        </label>
      </div>
    ))}
  </div>
);

export default Legend;
