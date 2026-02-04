import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client';

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const token: string | null = localStorage.getItem('accessToken');
  console.log('access_token in the provider',token);
  const refreshToken: string | null = localStorage.getItem('refreshToken');
  console.log(refreshToken);

  const API_URL = import.meta.env.VITE_API_URL;

  const httpLink = createHttpLink({
    uri: API_URL,
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
   
  return client;
};

export default createApolloClient;

