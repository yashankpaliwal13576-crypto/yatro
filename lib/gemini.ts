
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Exporting getAI to allow shared usage across components and ensuring new instances are created per request
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Decodes audio data from base64 string
 */
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Text-to-speech utility using browser API
 */
export function speakText(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Fetches specific details about a destination.
 */
export async function getDestinationDetails(destination: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide comprehensive details for "${destination}". Include a 2-sentence description, best months to visit, and 4 local attractions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          bestTimeToVisit: { type: Type.STRING },
          attractions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["description", "bestTimeToVisit", "attractions"]
      }
    }
  });
  try { return JSON.parse(response.text || "{}"); } catch (e) { return null; }
}

/**
 * Fetches trending cities based on month and location.
 */
export async function getSeasonalTrendingDestinations(month: string, latLng?: { latitude: number; longitude: number }) {
  const ai = getAI();
  const locationContext = latLng ? `The user is currently near latitude ${latLng.latitude}, longitude ${latLng.longitude}.` : "The user is in India.";
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 6 trending tourist cities in India specifically for the month of ${month}. ${locationContext} Return only city names.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try { return JSON.parse(response.text || "[]"); } catch (e) { return ["Manali", "Goa", "Munnar", "Jaipur", "Rishikesh", "Ooty"]; }
}

/**
 * Suggestions for destinations based on user preferences.
 */
export async function getDestinationSuggestions(prefs: { budget: string; interests: string; companions: string; stateOrRegion: string }) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 3 unique Indian destinations for a ${prefs.companions} trip with a ${prefs.budget} budget, focusing on ${prefs.interests}. Region: ${prefs.stateOrRegion || 'Anywhere in India'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            vibe: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["name", "vibe", "reason"]
        }
      }
    }
  });
  try { return JSON.parse(response.text || "[]"); } catch (e) { return []; }
}

/**
 * Streaming itinerary generation
 */
export async function* getSmartItineraryStream(destination: string, duration: number, latLng?: { latitude: number; longitude: number }, refreshCount = 0) {
  const ai = getAI();
  const locationContext = latLng ? `User location: ${latLng.latitude}, ${latLng.longitude}.` : "";
  const variantContext = refreshCount > 0 ? `This is version ${refreshCount + 1}. Suggest different unique activities than usual.` : "";
  
  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: `Create a detailed ${duration}-day travel itinerary for ${destination}. ${locationContext} ${variantContext} Format with clear daily headings. Include food recommendations.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  yield* response;
}

/**
 * Train connectivity information
 */
export async function getTrainInfo(from: string, to: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find popular trains between ${from} and ${to}. Provide real train names and numbers if possible. Include departure and arrival times and operating days.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trains: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                trainName: { type: Type.STRING },
                trainNumber: { type: Type.STRING },
                departure: { type: Type.STRING, description: "Time of departure e.g. 06:15 AM" },
                arrival: { type: Type.STRING, description: "Time of arrival e.g. 11:30 PM" },
                fromStation: { type: Type.STRING },
                toStation: { type: Type.STRING },
                operatingDays: { type: Type.STRING, description: "e.g. Daily, Mon-Fri, or specific days" }
              },
              required: ["trainName", "trainNumber", "departure", "arrival", "fromStation", "toStation", "operatingDays"]
            }
          },
          alternatives: { type: Type.STRING }
        },
        required: ["trains"]
      }
    }
  });
  try {
    const data = JSON.parse(response.text || "{\"trains\":[]}");
    return {
      trains: data.trains,
      alternatives: data.alternatives || null,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { trains: [], alternatives: null, grounding: [] };
  }
}

/**
 * Hotel/Stay recommendations
 */
export async function getHotelInfo(location: string, adults: string, children: string, priceRange: string, latLng?: { latitude: number; longitude: number }) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find top-rated ${priceRange} hotels in ${location} for exactly ${adults} adults and ${children} children. Include specific pricing and confirmed pax capacity in the response.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hotels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                locationNote: { type: Type.STRING },
                priceRange: { type: Type.STRING, description: "Current price per night with currency" },
                capacityNote: { type: Type.STRING, description: "e.g. Accommodates 2 Adults, 1 Child" }
              },
              required: ["name", "locationNote", "priceRange", "capacityNote"]
            }
          }
        }
      }
    }
  });
  try {
    return {
      hotels: JSON.parse(response.text || "{\"hotels\":[]}").hotels,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { hotels: [], grounding: [] };
  }
}

/**
 * Homestay recommendations
 */
export async function getHomestayInfo(location: string, adults: string, children: string, priceRange: string, latLng?: { latitude: number; longitude: number }) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find unique local homestays and villas in ${location} for ${adults} adults and ${children} children within ${priceRange} budget. Include specific pricing and Pax capacity notes.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hotels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                locationNote: { type: Type.STRING },
                priceRange: { type: Type.STRING, description: "Current price per night with currency" },
                capacityNote: { type: Type.STRING, description: "e.g. Accommodates 3 Adults, 2 Children" }
              },
              required: ["name", "locationNote", "priceRange", "capacityNote"]
            }
          }
        }
      }
    }
  });
  try {
    return {
      hotels: JSON.parse(response.text || "{\"hotels\":[]}").hotels,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { hotels: [], grounding: [] };
  }
}

/**
 * Flight information
 */
export async function getFlightInfo(from: string, to: string, adults: string, children: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Check flight availability from ${from} to ${to} for ${adults} adults and ${children} children. Provide major airline names and typical price ranges.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                airline: { type: Type.STRING },
                totalPrice: { type: Type.STRING }
              },
              required: ["airline", "totalPrice"]
            }
          }
        }
      }
    }
  });
  try {
    return {
      flights: JSON.parse(response.text || "{\"flights\":[]}").flights,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { flights: [], grounding: [] };
  }
}

/**
 * Cab information
 */
export async function getCabInfo(from: string, to: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Estimate cab travel details between ${from} and ${to}. Provide distance, estimated time, and costs for Mini, Prime, and SUV.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          distance: { type: Type.STRING },
          estimatedTime: { type: Type.STRING },
          estimates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                cost: { type: Type.STRING }
              },
              required: ["type", "cost"]
            }
          }
        }
      }
    }
  });
  try {
    return {
      ...JSON.parse(response.text || "{}"),
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { distance: "N/A", estimatedTime: "N/A", estimates: [], grounding: [] };
  }
}

/**
 * Comprehensive Trip Planner
 */
export async function getComprehensiveTripData(from: string, to: string, adults: string, children: string, priceRange: string, latLng?: { latitude: number; longitude: number }) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plan a comprehensive trip from ${from} to ${to} for ${adults} adults and ${children} children with a ${priceRange} budget. Include best transit options, stay recommendations, and a summary.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    fullPlan: response.text || "",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

/**
 * Nearby hotels for transit arrivals
 */
export async function getNearbyHotels(searchQuery: string, priceRange: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find hotels near ${searchQuery} in the ${priceRange} range.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hotels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                locationNote: { type: Type.STRING },
                priceRange: { type: Type.STRING },
                capacityNote: { type: Type.STRING, description: "Pax capacity" }
              },
              required: ["name", "locationNote", "priceRange"]
            }
          }
        }
      }
    }
  });
  try {
    return {
      hotels: JSON.parse(response.text || "{\"hotels\":[]}").hotels,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    return { hotels: [], grounding: [] };
  }
}
