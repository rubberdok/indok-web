const ResponseForm = ({ children }: { children: React.ReactNode }) => (
    <form>
        {children}
        <br />
        <button type="submit">Søk!</button>
    </form>
);

export default ResponseForm;
