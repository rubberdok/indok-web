const Slider = ({ title, range, placeholder }: { title: string; range: number[]; placeholder?: number }) => (
    <label>
        {title}
        <input type="range" min={range[0]} max={range[1]} value={placeholder} />
    </label>
);

export default Slider;
