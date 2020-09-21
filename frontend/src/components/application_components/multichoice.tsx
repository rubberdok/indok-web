const MultiChoice = ({ title, options }:{ title: string, options:string[] }) => (
    <>
        <label>{title}</label>
        <form>
            {options.map((option:string) => {
                return(
                    <>
                        <input type="checkbox" value={option}/>
                        <label>{option}</label>
                    </>
                )
            })}
        </form>
    </>
);

export default MultiChoice;