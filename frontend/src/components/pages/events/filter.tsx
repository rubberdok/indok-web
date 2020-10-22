import { useQuery } from "@apollo/client";
import { QUERY_EVENT_FILTERED_ORGANIZATIONS } from "@graphql/events/queries";

const Filter: React.FC = () => {
    const OrganizationFilter = () => {
        const { loading, error, data } = useQuery(QUERY_EVENT_FILTERED_ORGANIZATIONS, {
            pollInterval: 30000, // refetch the result every 30 second
        });
        // should handle loading status
        if (loading) return <p>Loading...</p>;

        if (error) return <p>Error :(</p>;

        return (
            <div style={{ float: "left", width: "25%", border: "solid", borderWidth: "0.05em", paddingLeft: "1em" }}>
                {data.eventFilteredOrganizations.map((org) => (
                    <div key={org.name} style={{}}>
                        <div>
                            <p>{org.name}</p>
                        </div>

                        {org.children?.map((subOrg) => (
                            <div key={subOrg.name} style={{ marginLeft: "2em", fontSize: "15px" }}>
                                <p>{subOrg.name}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h3 style={{ margin: "0px" }}>Filters</h3>
            <OrganizationFilter />
        </div>
    );
};

export default Filter;
