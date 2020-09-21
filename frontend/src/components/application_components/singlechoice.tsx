const SingleChoice = ({ title, options }:{ title: string, options: string[] }) => (
    <>
        <label>{title}</label>
        <form>
            {options.map((option:string) => {
                return(
                    <>
                        <input type="radio" value={option}/>
                        <label>{option}</label>
                    </>
                )
            })}
        </form>
    </>
);

export default SingleChoice;