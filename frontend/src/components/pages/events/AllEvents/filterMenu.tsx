import { useQuery } from "@apollo/client";
import { GET_CATEGORIES, QUERY_EVENT_FILTERED_ORGANIZATIONS } from "src/graphql_old/events/queries";
import { Category } from "@interfaces/events";
import { Organization } from "@interfaces/organizations";
import React from "react";
import { FilterQuery } from ".";

interface Props {
  filters: FilterQuery;
  onChange: (query: FilterQuery) => void;
}

const FilterMenu: React.FC<Props> = ({ filters, onChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleClick = () => {};

  const OrganizationFilter = () => {
    const { loading, error, data } = useQuery(QUERY_EVENT_FILTERED_ORGANIZATIONS);

    // should handle loading status
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
      <div>
        <h5 style={{ margin: "0px" }}>{"Organisasjoner"}</h5>
        {data.eventFilteredOrganizations.map((org: Organization) => (
          <div key={org.name}>
            <div
              style={{
                cursor: "pointer",
                width: "fit-content",
                color: filters?.organization === org.name ? "#065A5A" : "#707070",
                fontWeight: filters?.organization === org.name ? 700 : 500,
              }}
              aria-hidden="true"
              onClick={() => {
                onChange({ ...filters, organization: org.name });
              }}
              onKeyDown={handleClick}
            >
              <p style={{ marginBottom: "0px", marginTop: "0.05em" }}>{org.name}</p>
            </div>

            {org.children?.map((subOrg: Organization) => (
              <div
                key={subOrg.name}
                style={{
                  marginLeft: "2em",
                  fontSize: "15px",
                  cursor: "pointer",
                  width: "fit-content",
                  color:
                    filters?.organization === subOrg.name || filters?.organization === org.name ? "#065A5A" : "#909090",
                  fontWeight: filters?.organization === subOrg.name || filters?.organization === org.name ? 700 : 500,
                }}
                aria-hidden="true"
                onClick={() => {
                  onChange({ ...filters, organization: subOrg.name });
                }}
                onKeyDown={handleClick}
              >
                <p style={{ margin: "0px" }}>{subOrg.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const CategoryFilter = () => {
    const { loading, error, data } = useQuery(GET_CATEGORIES);

    // should handle loading status
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    return (
      <div>
        <h5 style={{ marginBottom: "0px" }}>{"Kategorier"}</h5>
        {data.allCategories.map((category: Category) => (
          <div
            key={category.name}
            style={{
              cursor: "pointer",
              width: "fit-content",
              color: filters?.category === category.name ? "#065A5A" : "#707070",
              fontWeight: filters?.category === category.name ? 700 : 500,
            }}
            aria-hidden="true"
            onClick={() => {
              onChange({ ...filters, category: category.name });
            }}
            onKeyDown={handleClick}
          >
            <p style={{ marginTop: "0px" }}>{category.name}</p>
          </div>
        ))}
      </div>
    );
  };

  const DateTimeFilter = () => {
    return (
      <div>
        <h5 style={{ margin: "0px" }}>{"Tidspunkt"}</h5>
        <div>
          <div>Fra:</div>
          <input
            type="datetime-local"
            placeholder="Start time"
            value={filters?.startTime}
            onChange={(e) => onChange({ ...filters, startTime: e.currentTarget.value })}
          />
        </div>
        <div>
          <div>Til:</div>
          <input
            type="datetime-local"
            placeholder="Start time"
            value={filters?.endTime}
            onChange={(e) => onChange({ ...filters, endTime: e.currentTarget.value })}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        float: "left",
        width: "25%",
        paddingLeft: "1em",
        border: "solid",
        borderWidth: "0.05em",
        borderColor: "#6A9997",
        borderRadius: "0.2em",
        backgroundColor: "#FFF",
        paddingBottom: "1em",
      }}
    >
      <h3 style={{ margin: "0px" }}>Filter</h3>
      <button onClick={() => onChange({})}>{"Nullstill filtre"}</button>
      <OrganizationFilter />
      <CategoryFilter />
      <DateTimeFilter />
    </div>
  );
};

export default FilterMenu;
