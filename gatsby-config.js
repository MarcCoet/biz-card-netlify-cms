module.exports = {
  siteMetadata: {
    title: 'Gatsby + Netlify CMS Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    {
      resolve: 'gatsby-source-apiserver',
      // resolve: 'gatsby-source-thirdparty',
      // resolve: 'thinhle-agilityio/gatsby-source-apiserver',
      options: {
        // Type prefix of entities from server
        typePrefix: 'test__',

        // The url, this should be the endpoint you are attempting to pull data from
        url: `https://marccoet.github.io/biz-card-netlify-cms-data/test.json`,

        method: 'get',

        headers: {
          'Content-Type': 'application/json',
        },

        // Request body
        data: {},

        // Name of the data to be downloaded.  Will show in graphQL or be saved to a file
        // using this name. i.e. posts.json
        name: `test`,

        // Nested level of entities in repsonse object, example: `data.posts`
        // entityLevel: `data.posts`

        // Define schemaType to normalize blank values
        // example:
        // const postType = {
        //   id: 1,
        //   name: 'String',
        //   published: true,
        //   object: {a: 1, b: '2', c: false},
        //   array: [{a: 1, b: '2', c: false}]
        // }
        // schemaType: postType

        // Simple authentication, if optional, set it null
        // auth: {
        //   username: 'myusername',
        //   password: 'supersecretpassword1234'
        // },
        auth: false,

        // Optional payload key name if your api returns your payload in a different key
        // Default will use the full response from the http request of the url
        // payloadKey: `body`,

        // Optionally save the JSON data to a file locally
        // Default is false
        // localSave: true,

        //  Required folder path where the data should be saved if using localSave option
        //  This folder must already exist
        // path: `${__dirname}/src/data/`,

        // Optionally include some output when building
        // Default is false
        verboseOutput: true, // For debugging purposes

        // Optionally skip creating nodes in graphQL.  Use this if you only want
        // The data to be saved locally
        // Default is false
        // skipCreateNode: true, // skip import to graphQL, only use if localSave is all you want
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [],
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
