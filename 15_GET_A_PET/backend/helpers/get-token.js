const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    return token;
  }
};

module.exports = getToken;
