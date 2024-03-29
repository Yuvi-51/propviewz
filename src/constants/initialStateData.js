import {
  Bold,
  Italic,
  Strikethrough,
  Underline
} from "lucide-react";

export const initialLoginData = {
  phone: "",
  otp: "",
  first_name: "",
  last_name: "",
};

export const dynamicStarConfig = {
  totalStars: 5,
  sharpness: 2.5,
  fullStarColor: "#FFBC00",
  emptyStarColor: "#c9c9c9",
};

export const advertisementCardsData = [
  {
    id: 1,
    img: "images/adverimage1.jpg",
  },
  {
    id: 2,
    img: "images/adverimgae2.jpg",
  },
  {
    id: 3,
    img: "images/adverimgae3.jpg",
  },
];

export const initialProjectReviewState = {
  project_name: "",
  project_id: "",
  project_review: {
    overall_rating: 0,
    location_rating: 0,
    amenities_rating: 0,
    floor_plan_rating: 0,
    value_for_money_rating: 0,
    customer_service_rating: 0,
    reviewer_type: "",
    text: "",
    project_medias_attributes: [],
  },
};
export const initialPostPictureState = {
  project_id: "",
  project_name: "",
  project_media: [],
};

export const initialBlogPostState = {
  blogTitle: "",
  coverImage: null,
};

export const txnReportInitValue = {
  txnType: "",
  unitType: "",
  config: "",
  buildName: "",
  floor: "",
  area: "",
};

export const userProfileInitValue = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  marital_status: "",
  gender: "",
  state: {},
  state_id: "",
  city: "",
  city_id: "",
  dob: "",
  email_verified: false,
  phone_verified: false,
};

export const addNewProjectInitValue = {
  project_name: "",
  location_id: "",
  city_id: "null",
  google_map_link: "",
  rera_number: "",
  brand_name: "",
};

export const valuationReportConfigurations = [
  // { name: "Studio/1RK/1BHK" },
  // { name: "1.5 to 2 BHK" },
  // { name: "2.5 to 3.5 BHK" },
  // { name: "4 & 4+ BHK" },
  // { name: "Studio" },
  { name: "Studio/1RK", value: "Studio/1RK" },
  { name: "1BHK", value: "1BHK" },
  { name: "1.5BHK", value: "1.5BHK" },
  { name: "2BHK", value: "2BHK" },
  { name: "2.5BHK", value: "2.5BHK" },
  { name: "3BHK", value: "3BHK" },
  { name: "3.5BHK", value: "3.5BHK" },
  { name: "4BHK", value: "4BHK" },
  { name: "4.5BHK", value: "4.5BHK" },
  { name: "5BHK", value: "5BHK" },
  { name: "5.5BHK", value: "5.5BHK" },
  { name: "6BHK", value: "6BHK" },
  { name: "6+BHK", value: "6.5BHK,7BHK,7.5BHK,8BHK" },
  // { name: "6+BHK" },
  // { name: "2RLK" },
  // { name: "2.5BHK" },
  // { name: "3RLK" },
  // { name: "3.5BHK" },
  // { name: "4BHK" },
  // { name: "5BHK" },
  // { name: "6BHK" },
  // { name: "7BHK" },
  // { name: "7+BHK" },
  // { name: "1.5BHK" },
  // { name: "4.5BHK" },
  // { name: "2RHK" },
  // { name: "1RHK" },
  // { name: "2.75BHK" },
  // { name: "Duplex" },
  // { name: "4BHK Duplex" },
  // { name: "3BHK Duplex" },
  // { name: "2BHK Duplex" },
  // { name: "5.5BHK" },
  // { name: "Multi. Room" },
];

export const projectLand = [
  { name: "Less than 1000 sq. mts ", value: 1000 },
  // { name: "Lease / Rent" },
  { name: "1000-2000 sq. mts", value: 1000 - 2000 },
  { name: "2000-4000 sq. mts", value: 2000 - 4000 },
  { name: "4000-8000 sq. mts.", value: 4000 - 8000 },
  { name: "8000-20,000 sq. mts.", value: 8000 - 20000 },
  { name: "More than 20,000 sq. mts. ", value: 20000 },
];
export const valuationReportTxnType = [
  { name: "Sale", value: "Sale" },
  // { name: "Lease / Rent" },
  { name: "Lease", value: "Lease" },
];
export const txnSaleType = [
  { name: "New Sale", value: "New Sale" },
  // { name: "Lease / Rent" },
  { name: "New Sale + Resale", value: "Sale" },
];
export const configurations = [
  { name: "1BHK", value: "1BHK", label: "1BHK" },
  { name: "2BHK", value: "2BHK", label: "2BHK" },
  { name: "3BHK", value: "3BHK", label: "3BHK" },
  { name: "4BHK", value: "4BHK", label: "4BHK" },
  { name: "4+ BHK", value: "4BHK,5BHK,BHK", label: "4+ BHK" },
];
export const txnDuration = [
  { name: "Last 3 Months", value: 3 },
  // { name: "Lease / Rent" },
  { name: "Last 6 Months", value: 6 },
  { name: "Last 9 Months", value: 9 },
  { name: "Last 12 Months", value: 12 },
];
export const Bhk_Wise = [
  { id: 1, name: "1BHK", value: "1bhk" },
  { id: 2, name: "2BHK", value: "2bhk" },
  { id: 3, name: "3BHK", value: "3bhk" },
  { id: 4, name: "4BHK", value: "4bhk" },
  { id: 5, name: "5BHK", value: "5bhk" },
];
export const proximity = [
  { name: "1 Km", value: 1000 },
  // { name: "Lease / Rent" },
  { name: "2 Km", value: 2000 },
  { name: "3 Km", value: 3000 },
  { name: "4 Km", value: 4000 },
  { name: "5 Km", value: 5000 },
  { name: "6 Km", value: 6000 },
  { name: "7 Km", value: 7000 },
  { name: "8 Km", value: 8000 },
  { name: "9 Km", value: 9000 },
  { name: "10 Km", value: 10000 },
];

export const valuationReportSelectState = [
  { name: "Maharashtra" },
  { name: "Goa" },
  { name: "Gujarat" },
  { name: "Karnataka" },
  { name: "Delhi" },
];
export const valuationReportCityOptions = [
  { name: "Pune", value: "Pune", cityId: 2209 },
  { name: "Mumbai", value: "Mumbai", cityId: 2126 },
];

export const valuationReportUnitTypes = [
  { name: "Flat", role: "Residential" },
  { name: "Bungalow", role: "Residential" },
  { name: "Rowhouse", role: "Residential" },
  { name: "Plot", role: "Residential" },
  // { name: "Plot", role: "Residential" },
  // { name: "Shop/Showroom (Ground Floor)", role: "Commercial" },
  // { name: "Shop/Showroom (1st Floor)", role: "Commercial" },
  // { name: "Shop/Showroom (2nd & 2nd+ Floor)", role: "Commercial" },
  { name: "Office", role: "Commercial" },
  { name: "Industrial Gala", role: "Commercial" },
  // { name: "Restaurant", role: "Commercial" },
  { name: "Restaurant/Cafe/Foodstall", role: "Commercial" },
  // { name: "Penthouse", role: "Commercial" },
  // { name: "Cafeteria", role: "Commercial" },
  { name: "Multipurpose Hall", role: "Commercial" },
  // { name: "Consulting Room", role: "Commercial" },
  { name: "Unit", role: "Commercial" },
  { name: "Shop", role: "Commercial" },
  { name: "Showroom", role: "Commercial" },
];
export const valuationReportUnitCategories = [
  { name: "Residential" },
  { name: "Commercial" },
];

export const claimProjectInitState = {
  project_id: "",
  user_id: "",
  full_name: "",
  mobile: "",
  email: "",
  company_name: "",
  designation: "",
  details: "",
};

export const projectReportErrorInitState = {
  isProjectChecked: false,
  isLocationChecked: false,
  projectInput: "",
  locationInput: "",
};

export const blogDescriptionStyleButtons = [
  {
    value: <Bold size={20} />,
    style: "BOLD",
  },

  {
    value: <Italic size={20} />,
    style: "ITALIC",
  },

  {
    value: <Underline size={20} />,
    style: "UNDERLINE",
  },

  {
    value: <Strikethrough size={20} />,
    style: "STRIKETHROUGH",
  },
];

export const locationFilterUnitCategory = [
  { title: "Resi. Sale", category: "Residential", type: "sale" },
  { title: "Resi. Lease", category: "Residential", type: "lease" },
  { title: "Com. Sale", category: "Commercial", type: "sale" },
  { title: "Com. Lease", category: "Commercial", type: "lease" },
];
export const locationFilterUnitType = {
  residential: ["Flat", "Plot", "Rowhouse /Bungalow"],
  commercial: ["Shop", "Office", "Industrial", "Plot"],
};

export const locationFilterConfigurations = [
  "1BHK",
  "2BHK",
  "2.5BHK",
  "3BHK",
  "4BHK",
  "5BHK",
  "6BHK",
  "7BHK",
  "7.5BHK",
];

export const cityData = [
  {
    id: 2209,
    img: "/images/Pune-logo.webp",
    name: "pune",
  },
  {
    id: 2126,
    img: "/images/mumbai-logo.webp",
    name: "mumbai",
  },
];
