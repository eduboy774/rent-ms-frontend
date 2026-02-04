import createApolloClient from '../apollo/createApolloClient';
import { GET_USER_PROFILE } from "../graphql/queries";

export const getUserProfileAndRole = async (accessToken: string, setUserProfileAndRoleData: (data: any) => void) => {
  const client = createApolloClient();

  try {
    const { loading, error, data } = await client.query({
      query: GET_USER_PROFILE,
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      fetchPolicy: 'no-cache',
    });

    if (loading || error) {
      console.error("GraphQL loading/error", { loading, error });
      return;
    }

    const userProfileAndRoleData = data.getUserProfileAndRole;    
    setUserProfileAndRoleData(userProfileAndRoleData);

    return userProfileAndRoleData;
  } catch (error) {
    console.error("Error fetching user profile and role:", error);
    throw error;
  }
};
