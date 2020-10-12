const ResponseForm: React.FC<{
    children?: React.ReactNode;
}> = ({ children }) => (
    <form>
        {children}
        <br />
        <button type="submit">Søk!</button>
    </form>
);

export default ResponseForm;
