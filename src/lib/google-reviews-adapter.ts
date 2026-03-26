export type ExternalReview = {
  name: string;
  quote: string;
  rating: number;
  source: string;
};

const fallbackGoogleReviews: ExternalReview[] = [
  {
    name: "Marcos A.",
    quote: "Agendamento pontual e corte muito consistente. Voltarei com certeza.",
    rating: 5,
    source: "Google",
  },
  {
    name: "Felipe R.",
    quote: "Ambiente muito bom e atendimento seguro do começo ao fim.",
    rating: 5,
    source: "Google",
  },
];

type GooglePlacesReview = {
  authorAttribution?: {
    displayName?: string;
  };
  rating?: number;
  text?: {
    text?: string;
  };
};

type GooglePlacesResponse = {
  reviews?: GooglePlacesReview[];
};

function getGoogleReviewsConfig() {
  return {
    apiKey: process.env.GOOGLE_PLACES_API_KEY?.trim(),
    placeId: process.env.GOOGLE_PLACE_ID?.trim(),
  };
}

function mapGooglePlacesReviews(reviews: GooglePlacesReview[] = []): ExternalReview[] {
  return reviews
    .map((review) => ({
      name: review.authorAttribution?.displayName?.trim() || "Cliente Google",
      quote: review.text?.text?.trim() || "",
      rating: review.rating ?? 5,
      source: "Google",
    }))
    .filter((review) => review.quote);
}

export function getFallbackGoogleReviews() {
  return fallbackGoogleReviews;
}

export async function getGoogleReviews() {
  const { apiKey, placeId } = getGoogleReviewsConfig();

  // Adapter preparado para integração real.
  // Quando você tiver as credenciais do cliente, preencha:
  // - GOOGLE_PLACES_API_KEY
  // - GOOGLE_PLACE_ID
  //
  // Se preferir usar Business Profile API no futuro, esta função é o ponto
  // certo para trocar a origem sem mexer no front.
  if (!apiKey || !placeId) {
    return {
      reviews: fallbackGoogleReviews,
      isFallback: true,
    };
  }

  const fields = ["reviews"];
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields.join(",")}&key=${apiKey}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel consultar as avaliações do Google.");
  }

  const payload = (await response.json()) as GooglePlacesResponse;
  const reviews = mapGooglePlacesReviews(payload.reviews);

  return {
    reviews: reviews.length > 0 ? reviews : fallbackGoogleReviews,
    isFallback: reviews.length === 0,
  };
}
