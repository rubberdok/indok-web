import { QueryVariables } from "../../../interfaces/cabins";

interface Props {
    range_update: (variables: QueryVariables) => void;
}

export const RangeBooking = ({ range_update }: Props) => {
    let year: HTMLInputElement;
    let month: HTMLInputElement;

    return (
        <form
            onSubmit={(e) => {
                range_update({
                    year: year.value,
                    month: month.value,
                });

                console.log(year.value, month.value);
                e.preventDefault();
            }}
        >
            <input
                //type="date"
                placeholder="År"
                ref={(node) => {
                    year = node as HTMLInputElement;
                }}
            />

            <input
                //type="date"
                placeholder="Måned"
                ref={(node) => {
                    month = node as HTMLInputElement;
                }}
            />

            <button type="submit">Finn ledige hytter</button>
        </form>
    );
};
