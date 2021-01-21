import { useQuery } from "@apollo/client";
import { User } from "@interfaces/users";
import { Listing } from "@interfaces/listings";
import { GET_USER } from "@graphql/auth/queries";
import { USER_RESPONSE } from "@graphql/listings/queries";
import CreateResponse from "@components/pages/listings/createResponse";
import TextField from "@components/pages/surveys/formComponents/textfield";

const Apply: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const { loading: userLoading, error: userError, data: userData } = useQuery<{ user: User }>(GET_USER);
  const { loading: responseLoading, error: responseError, data: responseData } = useQuery<{ response: Response }>(
    USER_RESPONSE,
    { variables: { listingID: listing.id } }
  );
  if (userLoading || userError || !userData || !userData.user) {
    return <p>Logg inn for å søke!</p>;
  } else {
    if (responseError) return <h1>Error</h1>;
    if (responseLoading) return <h1>Loading...</h1>;
    if (responseData) {
      if (responseData.response === null) {
        return <p>Du har søkt! Se søknad</p>;
      } else {
        return (
          <CreateResponse listing={listing} applicantID={userData.user.id}>
            <TextField title="Søk:" placeholder="Din søknad..." size="long" />m
          </CreateResponse>
        );
      }
    } else {
      return <></>;
    }
  }
};

export default Apply;
