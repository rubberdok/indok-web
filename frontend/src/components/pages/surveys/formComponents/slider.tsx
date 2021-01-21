const Slider: React.FC<{
  title: string;
  range: number[];
  placeholder?: number;
  key?: string;
}> = ({ title, range, placeholder, key }) => (
  <label key={key}>
    {title}
    <input type="range" min={range[0]} max={range[1]} value={placeholder} />
  </label>
);

export default Slider;
