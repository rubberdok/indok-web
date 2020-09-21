const TextField = ({ title, placeholder }:{ title: string, placeholder: string }) => (
    <label>{title}
        <input type="text" placeholder={placeholder}/>
    </label>
);

export default TextField;