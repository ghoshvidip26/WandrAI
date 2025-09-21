import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Amadeus API configuration
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

// Function to obtain access token from Amadeus
async function obtainAccessToken(): Promise<string> {
  const url = `${AMADEUS_BASE_URL}/v1/security/oauth2/token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_CLIENT_ID!,
      client_secret: AMADEUS_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Function to get hotels by city code
async function hotelAPI(cityCode: string) {
  const url = `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;
  const accessToken = await obtainAccessToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Hotel API request failed: ${response.statusText}`);
  }

  return await response.json();
}

// Function to fetch points of interest
async function fetchPointsOfInterest(lat: number, lng: number, radius: number) {
  const url = `${AMADEUS_BASE_URL}/v1/shopping/activities?longitude=${lng}&latitude=${lat}&radius=${radius}`;
  const accessToken = await obtainAccessToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Points of Interest API request failed: ${response.statusText}`
    );
  }

  return await response.json();
}

const TRAVEL_SYSTEM_PROMPT = `You are an expert travel advisor. Only provide travel-related information and recommendations. 
If a question is not related to travel (destinations, accommodations, transportation, activities, travel tips, culture, or local customs), 
politely explain that you can only help with travel-related queries.`;

export async function POST(req: NextRequest) {
  try {
    const { question, cityCode, latitude, longitude, radius } =
      await req.json();
    console.log("Received question:", question);
    console.log("City code:", cityCode);
    console.log("Coordinates:", { latitude, longitude, radius });

    let hotelData = null;
    let poiData = null;

    // If cityCode is provided, fetch hotel data
    if (cityCode) {
      try {
        console.log("Fetching hotel data for city code:", cityCode);
        hotelData = await hotelAPI(cityCode);
        console.log("Hotel data fetched successfully");
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        // Continue without hotel data if API fails
      }
    }

    // If coordinates are provided, fetch points of interest
    if (latitude && longitude) {
      try {
        const searchRadius = radius || 50; // Default radius of 50km
        console.log("Fetching points of interest for coordinates:", {
          latitude,
          longitude,
          radius: searchRadius,
        });
        poiData = await fetchPointsOfInterest(
          latitude,
          longitude,
          searchRadius
        );
        console.log("Points of interest data fetched successfully");
      } catch (error) {
        console.error("Error fetching points of interest:", error);
        // Continue without POI data if API fails
      }
    }

    // Enhance the system prompt with hotel and POI data if available
    let enhancedPrompt = TRAVEL_SYSTEM_PROMPT;

    if (hotelData && hotelData.data) {
      const hotelList = hotelData.data
        .slice(0, 10)
        .map(
          (hotel: any) =>
            `- ${hotel.name} (${hotel.address?.cityName || "N/A"})`
        )
        .join("\n");

      enhancedPrompt += `\n\nAvailable hotels in the requested city:\n${hotelList}`;
    }

    if (poiData && poiData.data) {
      const poiList = poiData.data
        .slice(0, 15)
        .map(
          (poi: any) =>
            `- ${poi.name}: ${
              poi.shortDescription ||
              poi.description ||
              "No description available"
            } (Rating: ${poi.rating || "N/A"})`
        )
        .join("\n");

      enhancedPrompt += `\n\nPoints of Interest and Activities in the area:\n${poiList}`;
    }

    if (hotelData?.data || poiData?.data) {
      enhancedPrompt += `\n\nUse this information to provide specific recommendations when relevant to the user's question.`;
    }

    const completion = await openai.chat.completions.create(
      {
        model: "qwen/qwen2.5-vl-32b-instruct:free",
        messages: [
          { role: "system", content: enhancedPrompt },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI Travel Planner",
        },
      }
    );

    console.log("OpenRouter Response:", completion);

    if (!completion.choices?.[0]?.message?.content) {
      console.error("Unexpected API response format:", completion);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: completion.choices[0].message.content,
      hotelData: hotelData?.data || null,
      pointsOfInterest: poiData?.data || null,
    });
  } catch (error: any) {
    console.error("Error in request:", error);
    const errorMessage = error?.message || "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
