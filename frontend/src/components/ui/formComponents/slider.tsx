const Slider: React.FC<{
  range: number[];
  title?: string;
  placeholder?: number;
}> = ({ range, title, placeholder }) => (
  <>
    {title && <label>{title}</label>}
    <input type="range" min={range[0]} max={range[1]} value={placeholder} />
  </>
);

export default Slider;
