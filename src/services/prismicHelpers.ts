// ~/utils/prismicHelpers.js
import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import Link from 'next/link';
import {
  apiEndpoint,
  accessToken,
  linkResolver,
  routeResolver,
} from '../../prismicConfiguration';

// Options to be passed to the Client
const createClientOptions = (
  req = null,
  prismicAccessToken = null,
  routes = null
): any => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};
  const routesOption = routes ? { routes: routeResolver.routes } : {};
  return {
    ...reqOption,
    ...accessTokenOption,
    ...routesOption,
  };
};

// -- @prismicio/client initialisation
// Initialises the Prismic Client that's used for querying the API and passes it any query options.
export const Client = (req = null): DefaultClient =>
  Prismic.client(
    apiEndpoint,
    createClientOptions(req, accessToken, routeResolver)
  );

export default Client;
