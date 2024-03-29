import { validateImageUrl } from "@/logic/validation";

export const JSON_LD_SCHEMA = (property) => {
  // Conditionally render aggregateRating based on average_rating, total_ratings, latest_transaction etc.

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${property?.name} in ${property?.detailed_area}, ${property?.city}`,
    description: ` ${property?.name}, ${property?.city}: View project reviews & last transaction price list of ${property?.name} ${property?.detailed_area}, ${property?.city}.`,
    image: [validateImageUrl(property?.thumbnail)],
    address: {
      "@type": "PostalAddress",
      streetAddress: property?.detailed_area,
      addressLocality: property?.city,
      addressCountry: "India",
    },
    ...(Number(property?.average_rating) > 0 &&
      Number(property?.total_ratings) > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: Number(property?.average_rating),
          reviewCount: Number(property?.total_ratings),
        },
      }),
    ...(Number(property?.latest_transaction?.value) && {
      offers: {
        "@type": "AggregateOffer",
        price: Number(property?.latest_transaction?.value),
        priceCurrency: "INR",
      },
    }),
    ...(Number(property?.latest_transaction?.area?.total) && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: Number(property?.latest_transaction?.area?.total),
        unitCode: "SQ.FT",
      },
    }),
  };
};
