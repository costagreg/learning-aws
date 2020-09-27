const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

// Configure Userpool ID
const userPoolId = "{{userPoolId}}";

// Copy keys property from https://cognito-idp.us-east-2.amazonaws.com/{{USER-POOL-ID}}/.well-known/jwks.json
const JWKSKeys = [];

const region = "us-east-1";
const iss = "https://cognito-idp." + region + ".amazonaws.com/" + userPoolId;
const pems = JWKSKeys.reduce((acc, { kid, n, e, kty }) => {
  const jwk = { kty, n, e };
  const pem = jwkToPem(jwk);
  acc[kid] = pem;

  return acc;
}, {});

const parseCookies = (headers) => {
  if (headers.cookie) {
    const cookies = headers.cookie[0].value.split(";");

    return cookies.reduce((acc, cookie) => {
      if (cookie) {
        const [key, value] = cookie.split("=");

        acc[key.trim()] = value.trim();
      }

      return acc;
    }, {});
  }

  return {};
};

const response401 = {
  status: "401",
  statusDescription: "Unauthorized",
};

exports.handler = (event, context, callback) => {
  const cfrequest = event.Records[0].cf.request;
  if (!cfrequest.uri.startsWith("/static/js/protectedBundle")) {
    // Request is not for protected content. Pass through
    console.log('Passing!')
    callback(null, cfrequest);
    return true;
  }

  const headers = cfrequest.headers;

  if (headers.cookie) {
    const cookies = parseCookies(headers);
    const accessTokenKey = Object.keys(cookies).find((key) => key.includes('accessToken'))

    let jwtToken = null

    if(accessTokenKey){
      jwtToken = cookies[accessTokenKey]
    }

    //Fail if no authorization header found
    if (jwtToken === null) {
      callback(null, response401);
      return false;
    }

    //Fail if the token is not jwt
    let decodedJwt = jwt.decode(jwtToken, { complete: true });
    if (!decodedJwt) {
      callback(null, response401);
      return false;
    }

    //Fail if token is not from your UserPool
    if (decodedJwt.payload.iss !== iss) {
      callback(null, response401);
      return false;
    }

    //Reject the jwt if it's not an 'Access Token'
    if (decodedJwt.payload.token_use !== "access") {
      callback(null, response401);
      return false;
    }

    //Get the kid from the token and retrieve corresponding PEM
    const { kid } = decodedJwt.header;
    const pem = pems[kid];

    if (!pem) {
      callback(null, response401);
      return false;
    }

    //Verify the signature of the JWT token to ensure it's really coming from your User Pool
    jwt.verify(jwtToken, pem, { issuer: iss }, (err, payload) => {
      if (err) {
        callback(null, response401);
        return false;
      } else {
        //Valid token.
        console.log("Successful verification");
        //remove authorization header
        delete cfrequest.headers.cookie;
        //CloudFront can proceed to fetch the content from origin
        callback(null, cfrequest);
        return true;
      }
    });
  }

  callback(null, response401);
  return false;

};
