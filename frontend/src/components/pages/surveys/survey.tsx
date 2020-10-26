import { useQuery } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";

const Survey: React.FC = () => {
    { error, loading, data } = useQuery(SURVEY)
};