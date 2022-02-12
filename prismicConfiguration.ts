import { Document } from '@prismicio/client/types/documents';

// -- Prismic Repo Name
export const repoName = 'ignite-blog-maria-diniz';

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = `https://${repoName}.cdn.prismic.io/api/v2`;

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken =
  'MC5ZZ2d3bEJFQUFDd0FmRFYz.77-977-9MO-_ve-_ve-_vXzvv73vv73vv73vv73vv73vv73vv70E77-9Le-_ve-_ve-_ve-_vX7vv73vv73vv71tAO-_ve-_vSzvv70U';

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export const linkResolver = (doc: Document): string => {
  if (doc.type === 'page') {
    return `/${doc.uid}`;
  }
  return '/';
};

// -- Route Resolver rules
// Manages the url links to internal Prismic documents two levels deep (optionals)
export const routeResolver = {
  routes: [
    {
      type: 'page',
      path: '/:uid',
    },
  ],
};
