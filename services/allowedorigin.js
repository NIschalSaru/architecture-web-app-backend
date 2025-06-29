// const allowOrigin = [
//   {
//     origin: [
//       "http://localhost:3000",
//       "https://nepaldesignersandbuilders.netlify.app",
//       "https://nd-nb.netlify.app/",
//       "https://ndnb-uat.netlify.app",
//     ],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   },
// ];

// module.exports = allowOrigin;

const allowOrigin = {
  origins: [
    "http://localhost:3000",
    "https://nepaldesignersandbuilders.netlify.app",
    "https://nd-nb.netlify.app",
    "https://ndnb-uat.netlify.app",
    "http://stg.ndnb.com.np",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = allowOrigin;
