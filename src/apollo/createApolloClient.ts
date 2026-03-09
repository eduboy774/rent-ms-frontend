import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, Observable } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client';
import { startRequest, endRequest } from '../utils/loaderManager';

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

  const loadingLink = new ApolloLink((operation, forward) => {
    // signal loader start
    startRequest();

    return new Observable((observer: any) => {
      const sub = forward(operation).subscribe({
        next: (result: any) => {
          observer.next(result);
        },
        error: (err: any) => {
          observer.error(err);
          endRequest();
        },
        complete: () => {
          observer.complete();
          endRequest();
        },
      });

      return () => {
        try {
          sub.unsubscribe();
        } catch (e) {
          // ignore
        }
        endRequest();
      };
    });
  });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link: ApolloLink.from([loadingLink, httpLink]),
    cache: new InMemoryCache(),
  });
   
  return client;
};

export default createApolloClient;

