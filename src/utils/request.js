export const request = async ({
  url,
  method,
  body,
  headers = {
    "Content-Type": "application/json",
  },
}) => {
  const apiUrl = `http://localhost:3001${url}`;
  const fetchBody = {
    method,
    headers,
  };

  if (body) {
    fetchBody.body = body;
  }

  const response = await fetch(apiUrl, fetchBody);

  if (response.ok) {
    return response.json();
  } else {
    return response.json().then((error) => {
      throw error;
    });
  }
};
