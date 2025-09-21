import axios from "axios";

export async function fetchWeather(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const response = await axios.get(url);
  console.log("Response:", response.data);
  return response.data;
}

export async function obtainAccessToken() {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const payload = {
    grant_type: "client_credentials",
    client_id: process.env.AMEDUS_API_KEY || "",
    client_secret: process.env.AMEDUS_API_SECRET || "",
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const response = await axios.post(url, new URLSearchParams(payload), {
    headers,
  });
  return response.data.access_token;
}

export async function fetchCityDetails(keyword: string) {
  const accessToken = await obtainAccessToken();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const params = { keyword, subType: "CITY,AIRPORT" };

  const response = await axios.get(
    "https://test.api.amadeus.com/v1/reference-data/locations",
    { headers, params }
  );

  const location = response.data.data;

  return {
    cities: location.filter((c: { subType: string }) => c.subType === "CITY"),
    airports: location.filter(
      (c: { subType: string }) => c.subType === "AIRPORT"
    ),
  };
}
