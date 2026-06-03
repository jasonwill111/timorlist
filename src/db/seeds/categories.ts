/**
 * Listing Categories Seed Data
 * TimorUp - Classification Ads Categories (v2.0)
 *
 * Taxonomy: 10 primary categories, 89 total categories
 * Each category has:
 * - name: Display name
 * - slug: URL-friendly identifier  
 * - description: Category description
 * - icon: Emoji icon
 * - parentId: Parent category (null for top-level)
 * - formFields: JSON schema for category-specific fields
 * - sortOrder: Display order
 * - isActive: Active status
 */

import { sql } from 'drizzle-orm';

// Field types: text, number, select, multi-select, boolean, date, url, email, textarea, images

// ============================================
// 1. VEHICLES (vehicles) - 9 sub-categories
// ============================================
const vehiclesFormFields = JSON.stringify([
  { name: "make", type: "text", label: "Make/Brand", required: true },
  { name: "model", type: "text", label: "Model", required: true },
  { name: "year", type: "number", label: "Year", required: true, min: 1900, max: 2027 },
  { name: "condition", type: "select", label: "Condition", required: true, options: ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"] },
  { name: "price", type: "number", label: "Price", required: true, min: 0 },
  { name: "negotiable", type: "boolean", label: "Price Negotiable" },
  { name: "mileage", type: "number", label: "Mileage (km)", min: 0 },
  { name: "fuelType", type: "select", label: "Fuel Type", options: ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG", "Other"] },
  { name: "transmission", type: "select", label: "Transmission", options: ["Manual", "Automatic", "Semi-Auto", "CVT"] },
  { name: "color", type: "text", label: "Color" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "features", type: "multi-select", label: "Features", options: ["Sunroof", "Leather Seats", "GPS Navigation", "Bluetooth", "Backup Camera", "Heated Seats", "Cruise Control", "4WD/AWD", "ABS", "Airbags", "Parking Sensors", "Apple CarPlay", "Android Auto", "Adaptive Cruise", "Lane Keep Assist"] },
  { name: "images", type: "images", label: "Photos", max: 16 },
  { name: "registered", type: "boolean", label: "Vehicle Registered" },
  { name: "registeredUntil", type: "date", label: "Registration Valid Until" },
  { name: "warranty", type: "boolean", label: "Warranty Available" },
  { name: "deliveryAvailable", type: "boolean", label: "Delivery Available" },
  { name: "exchangeAccepted", type: "boolean", label: "Exchange/Trade Accepted" }
]);

// Cars & SUVs
const carsSuvsFormFields = JSON.stringify([
  { name: "bodyType", type: "select", label: "Body Type", options: ["Sedan", "SUV", "Hatchback", "Coupe", "Wagon", "Convertible", "Van", "Truck", "Pickup", "Minivan"] },
  { name: "engineSize", type: "text", label: "Engine Size (L)" },
  { name: "drivetrain", type: "select", label: "Drivetrain", options: ["FWD", "RWD", "4WD", "AWD"] },
  { name: "seatingCapacity", type: "number", label: "Seating Capacity", min: 1, max: 15 },
  { name: "fuelEfficiency", type: "text", label: "Fuel Efficiency (L/100km)" }
]);

// Motorcycles
const motorcyclesFormFields = JSON.stringify([
  { name: "engineSize_cc", type: "number", label: "Engine Size (cc)", min: 50 },
  { name: "helmetIncluded", type: "boolean", label: "Helmet Included" },
  { name: "helmetCount", type: "number", label: "Number of Helmets", min: 0 },
  { name: "licensePlate", type: "text", label: "License Plate" },
  { name: "motorcycleType", type: "select", label: "Type", options: ["Sport", "Cruiser", "Touring", "Adventure", "Naked", "Scooter", "Moped", "Dirt Bike", "Cafe Racer"] }
]);

// Bicycles
const bicyclesFormFields = JSON.stringify([
  { name: "bicycleType", type: "select", label: "Bicycle Type", options: ["Mountain", "Road", "Hybrid", "BMX", "Kids", "Electric", "Folding", "Cargo"] },
  { name: "frameSize", type: "text", label: "Frame Size" },
  { name: "suspension", type: "select", label: "Suspension", options: ["None", "Front", "Full"] },
  { name: "brakes", type: "select", label: "Brakes", options: ["Disc", "V-Brake", "Coaster", "Hydraulic"] },
  { name: "gearCount", type: "number", label: "Number of Gears" }
]);

// Vans & Trucks
const vansTrucksFormFields = JSON.stringify([
  { name: "loadCapacity", type: "number", label: "Load Capacity (kg)" },
  { name: "cabType", type: "select", label: "Cab Type", options: ["Regular", "Extended", "Crew"] },
  { name: "numberOfSeats", type: "number", label: "Number of Seats", min: 1, max: 15 },
  { name: "bedLength", type: "text", label: "Bed/Load Area Length (m)" },
  { name: "boxType", type: "select", label: "Box Type", options: ["Open", "Closed", "Refrigerated", "Flatbed"] }
]);

// Boats & Marine
const boatsMarineFormFields = JSON.stringify([
  { name: "length", type: "number", label: "Length (m)" },
  { name: "boatType", type: "select", label: "Boat Type", options: ["Sailboat", "Motorboat", "Yacht", "Jet Ski", "Fishing Boat", "Pontoon", "Kayak/Canoe", "Inflatable"] },
  { name: "hullMaterial", type: "select", label: "Hull Material", options: ["Fiberglass", "Aluminum", "Wood", "Steel", "Inflatable"] },
  { name: "engineType", type: "select", label: "Engine Type", options: ["Outboard", "Inboard", "None"] },
  { name: "enginePower", type: "text", label: "Engine Power (HP)" },
  { name: "capacity", type: "number", label: "Max Capacity (persons)" }
]);

// RVs & Campers
const rvsCampersFormFields = JSON.stringify([
  { name: "sleepingCapacity", type: "number", label: "Sleeping Capacity", min: 1 },
  { name: "bathrooms", type: "number", label: "Number of Bathrooms", min: 0 },
  { name: "hasKitchen", type: "boolean", label: "Kitchen Available" },
  { name: "yearBuilt", type: "number", label: "Year Built", min: 1970, max: 2027 },
  { name: "slideouts", type: "number", label: "Number of Slideouts", min: 0 },
  { name: "rvType", type: "select", label: "RV Type", options: ["Class A", "Class B", "Class C", "Travel Trailer", "Fifth Wheel", "Pop-up Camper", "Truck Camper"] }
]);

// Parts & Accessories
const vehiclePartsFormFields = JSON.stringify([
  { name: "partType", type: "select", label: "Part Type", options: ["Engine", "Transmission", "Suspension", "Brakes", "Electrical", "Interior", "Exterior", "Wheels/Tires", "Audio/Electronics", "Other"] },
  { name: "compatibleMake", type: "text", label: "Compatible Make(s)" },
  { name: "compatibleModel", type: "text", label: "Compatible Model(s)" },
  { name: "newUsed", type: "select", label: "Condition", options: ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"] },
  { name: "warrantyPeriod", type: "text", label: "Warranty Period" },
  { name: "partNumber", type: "text", label: "Part Number" }
]);

// Agricultural Vehicles
const agriVehiclesFormFields = JSON.stringify([
  { name: "horsepower", type: "number", label: "Horsepower (HP)" },
  { name: "hoursUsed", type: "number", label: "Hours Used" },
  { name: "implementsIncluded", type: "boolean", label: "Implements Included" },
  { name: "drivetrain", type: "select", label: "Drivetrain", options: ["2WD", "4WD"] },
  { name: "ptoHp", type: "number", label: "PTO Horsepower" },
  { name: "threePointHitch", type: "boolean", label: "3-Point Hitch" }
]);

// ============================================
// 2. PROPERTY SALE (property-sale) - 8 sub-categories
// ============================================
const propertySaleFormFields = JSON.stringify([
  { name: "propertyType", type: "select", label: "Property Type", required: true, options: ["House", "Apartment", "Condo", "Townhouse", "Duplex", "Land", "Commercial", "Industrial"] },
  { name: "price", type: "number", label: "Price", required: true, min: 0 },
  { name: "negotiable", type: "boolean", label: "Price Negotiable" },
  { name: "condition", type: "select", label: "Condition", options: ["New", "Excellent", "Good", "Needs Renovation", "Under Construction"] },
  { name: "landSize", type: "number", label: "Land Size (m²)", min: 0 },
  { name: "buildingSize", type: "number", label: "Building Size (m²)", min: 0 },
  { name: "bedrooms", type: "number", label: "Bedrooms", min: 0 },
  { name: "bathrooms", type: "number", label: "Bathrooms", min: 0, max: 20 },
  { name: "floors", type: "number", label: "Number of Floors", min: 1 },
  { name: "parkingSpaces", type: "number", label: "Parking Spaces", min: 0 },
  { name: "location", type: "text", label: "Address", required: true },
  { name: "city", type: "text", label: "City/Town" },
  { name: "district", type: "text", label: "District/Area" },
  { name: "features", type: "multi-select", label: "Features & Amenities", options: ["Garden", "Swimming Pool", "Garage", "Balcony", "Security System", "Elevator/Lift", "Furnished", "Air Conditioning", "Central Heating", "Water Supply 24/7", "Electricity 24/7", "Internet/WiFi", "Cable TV", "Fire Alarm", "Wheelchair Accessible"] },
  { name: "viewType", type: "multi-select", label: "View Type", options: ["City View", "Sea View", "Mountain View", "Garden View", "Pool View", "River View", "No Specific View"] },
  { name: "ownershipType", type: "select", label: "Ownership Type", options: ["Freehold", "Leasehold", "Strata/Condo", "Cooperative", "Government Lease"] },
  { name: "titleDeedAvailable", type: "boolean", label: "Title Deed Available" },
  { name: "yearBuilt", type: "number", label: "Year Built" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "images", type: "images", label: "Photos", max: 20 },
  { name: "videoTour", type: "url", label: "Video Tour URL" }
]);

// Land & Plots
const landPlotsFormFields = JSON.stringify([
  { name: "landType", type: "select", label: "Land Type", options: ["Residential", "Commercial", "Agricultural", "Industrial", "Mixed Use"] },
  { name: "zoning", type: "text", label: "Zoning Classification" },
  { name: "roadAccess", type: "select", label: "Road Access", options: ["Paved Road", "Dirt Road", "No Direct Access", "Shared Access"] },
  { name: "waterAccess", type: "boolean", label: "Water Access" },
  { name: "electricityAccess", type: "boolean", label: "Electricity Access" },
  { name: "floodRisk", type: "select", label: "Flood Risk", options: ["None", "Low", "Medium", "High", "Unknown"] }
]);

// Commercial Buildings
const commercialBuildingsFormFields = JSON.stringify([
  { name: "businessType", type: "select", label: "Suitable For", options: ["Retail", "Office", "Restaurant", "Hotel", "Warehouse", "Medical", "Educational", "Entertainment"] },
  { name: "floorCount", type: "number", label: "Number of Floors" },
  { name: "elevatorAvailable", type: "boolean", label: "Elevator Available" },
  { name: "parkingSpaces", type: "number", label: "Parking Spaces" },
  { name: "operatingBusiness", type: "boolean", label: "Currently Operating Business" }
]);

// Industrial Buildings
const industrialBuildingsFormFields = JSON.stringify([
  { name: "workshopSpace", type: "number", label: "Workshop Space (m²)" },
  { name: "officeSpace", type: "number", label: "Office Space (m²)" },
  { name: "loadingBay", type: "boolean", label: "Loading Bay Available" },
  { name: "craneCapacity", type: "text", label: "Crane Capacity (tons)" },
  { name: "clearHeight", type: "number", label: "Clear Height (m)" },
  { name: "floorLoading", type: "text", label: "Floor Loading Capacity" }
]);

// ============================================
// 3. FOR SALE (for-sale) - 12 sub-categories
// ============================================
const forSaleFormFields = JSON.stringify([
  { name: "title", type: "text", label: "Title", required: true, maxLength: 100 },
  { name: "category", type: "category", label: "Category", required: true },
  { name: "condition", type: "select", label: "Condition", required: true, options: ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"] },
  { name: "price", type: "number", label: "Price", required: true, min: 0 },
  { name: "negotiable", type: "boolean", label: "Price Negotiable" },
  { name: "quantity", type: "number", label: "Quantity Available", min: 1, defaultValue: 1 },
  { name: "brand", type: "text", label: "Brand" },
  { name: "model", type: "text", label: "Model/Serial Number" },
  { name: "color", type: "text", label: "Color" },
  { name: "size", type: "text", label: "Size" },
  { name: "material", type: "text", label: "Material" },
  { name: "dimensions", type: "text", label: "Dimensions (L x W x H)" },
  { name: "weight", type: "number", label: "Weight (kg)", min: 0 },
  { name: "warranty", type: "boolean", label: "Warranty Available" },
  { name: "warrantyExpiry", type: "date", label: "Warranty Expires" },
  { name: "originalPackaging", type: "boolean", label: "Original Packaging" },
  { name: "receiptAvailable", type: "boolean", label: "Receipt Available" },
  { name: "location", type: "text", label: "Location" },
  { name: "deliveryAvailable", type: "boolean", label: "Delivery Available" },
  { name: "deliveryFee", type: "number", label: "Delivery Fee" },
  { name: "meetupPreferred", type: "boolean", label: "Meetup Preferred" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "defects", type: "textarea", label: "Known Defects/Issues" },
  { name: "images", type: "images", label: "Photos", max: 12 }
]);

// Electronics
const electronicsFormFields = JSON.stringify([
  { name: "storage", type: "text", label: "Storage Capacity (GB/TB)" },
  { name: "ram", type: "text", label: "RAM (GB)" },
  { name: "screenSize", type: "text", label: "Screen Size" },
  { name: "networkType", type: "select", label: "Network", options: ["WiFi Only", "WiFi + Cellular", "4G", "5G"] },
  { name: "batteryHealth", type: "number", label: "Battery Health (%)", min: 0, max: 100 },
  { name: "operatingSystem", type: "select", label: "Operating System", options: ["iOS", "Android", "Windows", "macOS", "Linux", "Not Applicable"] },
  { name: "accessoriesIncluded", type: "multi-select", label: "Accessories Included", options: ["Charger", "Cable", "Case", "Earbuds", "Manual", "Original Box"] }
]);

// Fashion
const fashionFormFields = JSON.stringify([
  { name: "gender", type: "select", label: "Gender", options: ["Men", "Women", "Unisex", "Boys", "Girls", "Kids"] },
  { name: "clothingSize", type: "text", label: "Clothing Size" },
  { name: "shoeSize", type: "text", label: "Shoe Size (EU/US/UK)" },
  { name: "waistSize", type: "text", label: "Waist Size" },
  { name: "chestSize", type: "text", label: "Chest Size" },
  { name: "material", type: "text", label: "Material/Fabric" },
  { name: "designer", type: "text", label: "Designer/Brand" },
  { name: "authentic", type: "boolean", label: "Authentic/Original" }
]);

// Musical Instruments
const musicalInstrumentsFormFields = JSON.stringify([
  { name: "instrumentType", type: "select", label: "Instrument Type", options: ["Guitar", "Piano/Keyboard", "Drums", "Violin", "Saxophone", "Trumpet", "Flute", "Other"] },
  { name: "isElectric", type: "boolean", label: "Electric/Acoustic" },
  { name: "caseIncluded", type: "boolean", label: "Case Included" },
  { name: "ampIncluded", type: "boolean", label: "Amplifier Included" },
  { name: "age", type: "text", label: "Age of Instrument" },
  { name: "modifications", type: "text", label: "Modifications/Upgrades" }
]);

// ============================================
// 4. JOBS (jobs) - 7 sub-categories (no specific fields)
// ============================================
const jobsFormFields = JSON.stringify([
  { name: "jobTitle", type: "text", label: "Job Title", required: true, maxLength: 100 },
  { name: "companyName", type: "text", label: "Company Name", required: true },
  { name: "companyLogo", type: "image", label: "Company Logo" },
  { name: "companySize", type: "select", label: "Company Size", options: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] },
  { name: "companyIndustry", type: "text", label: "Industry" },
  { name: "employmentType", type: "select", label: "Employment Type", required: true, options: ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote", "Seasonal"] },
  { name: "salaryMin", type: "number", label: "Min Salary" },
  { name: "salaryMax", type: "number", label: "Max Salary" },
  { name: "salaryCurrency", type: "select", label: "Currency", options: ["USD", "IDR", "AUD", "EUR", "GBP", "SGD", "MYR", "PHP", "THB", "VND"] },
  { name: "salaryPeriod", type: "select", label: "Salary Period", options: ["hour", "day", "week", "month", "year"] },
  { name: "salaryNegotiable", type: "boolean", label: "Salary Negotiable" },
  { name: "experienceLevel", type: "select", label: "Experience Level", options: ["Entry Level", "Junior (1-3 years)", "Mid Level (3-5 years)", "Senior (5-10 years)", "Lead/Manager", "Executive"] },
  { name: "educationLevel", type: "select", label: "Education Required", options: ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Any"] },
  { name: "qualifications", type: "textarea", label: "Qualifications Required" },
  { name: "skills", type: "multi-select", label: "Skills Required", options: ["Communication", "Leadership", "Problem Solving", "Teamwork", "Adaptability", "Time Management", "Technical Writing", "Project Management", "Data Analysis", "Customer Service"] },
  { name: "jobDescription", type: "textarea", label: "Job Description" },
  { name: "responsibilities", type: "textarea", label: "Key Responsibilities" },
  { name: "benefits", type: "textarea", label: "Benefits & Perks" },
  { name: "location", type: "text", label: "Work Location", required: true },
  { name: "city", type: "text", label: "City" },
  { name: "remoteAllowed", type: "boolean", label: "Remote/Hybrid Allowed" },
  { name: "travelRequired", type: "boolean", label: "Travel Required" },
  { name: "applicationDeadline", type: "date", label: "Application Deadline" },
  { name: "startDate", type: "date", label: "Start Date" },
  { name: "contactName", type: "text", label: "Contact Person" },
  { name: "contactEmail", type: "email", label: "Contact Email", required: true },
  { name: "contactPhone", type: "text", label: "Contact Phone" },
  { name: "applicationUrl", type: "url", label: "Apply Online URL" },
  { name: "images", type: "images", label: "Company/Office Photos", max: 5 }
]);

// ============================================
// 5. SERVICES (services) - 8 sub-categories
// ============================================
const servicesFormFields = JSON.stringify([
  { name: "serviceName", type: "text", label: "Service/Business Name", required: true },
  { name: "serviceType", type: "select", label: "Service Category", required: true, options: ["Professional", "Home", "Beauty", "Education", "Events", "Transport", "Pet", "Other"] },
  { name: "pricingType", type: "select", label: "Pricing Type", required: true, options: ["Fixed Price", "Hourly Rate", "Daily Rate", "Per Project", "Starting From", "Negotiable", "Free"] },
  { name: "price", type: "number", label: "Price", min: 0 },
  { name: "priceCurrency", type: "select", label: "Currency", options: ["USD", "IDR", "AUD", "EUR", "GBP", "SGD"] },
  { name: "priceIncludes", type: "textarea", label: "Price Includes" },
  { name: "serviceArea", type: "text", label: "Service Area/Coverage" },
  { name: "remoteAvailable", type: "boolean", label: "Remote/Online Available" },
  { name: "availability", type: "select", label: "Availability", options: ["Available Now", "By Appointment", "Weekdays Only", "Weekends Only", "Evenings Only", "Flexible"] },
  { name: "workingHours", type: "text", label: "Working Hours", placeholder: "e.g., Mon-Fri 9AM-6PM" },
  { name: "responseTime", type: "select", label: "Response Time", options: ["Within 1 hour", "Within 24 hours", "Within 3 days", "Within 1 week"] },
  { name: "description", type: "textarea", label: "Service Description" },
  { name: "experience", type: "number", label: "Years of Experience" },
  { name: "qualifications", type: "textarea", label: "Qualifications/Certifications" },
  { name: "portfolio", type: "url", label: "Portfolio/Website URL" },
  { name: "insured", type: "boolean", label: "Fully Insured" },
  { name: "bonded", type: "boolean", label: "Bonded" },
  { name: "homeVisit", type: "boolean", label: "Home Visit Available" },
  { name: "emergencyService", type: "boolean", label: "Emergency Service" },
  { name: "rushJobAvailable", type: "boolean", label: "Rush Job Available" },
  { name: "contactName", type: "text", label: "Contact Person" },
  { name: "contactPhone", type: "text", label: "Phone" },
  { name: "contactWhatsApp", type: "text", label: "WhatsApp" },
  { name: "contactEmail", type: "email", label: "Email" },
  { name: "rating", type: "number", label: "Average Rating", min: 0, max: 5 },
  { name: "reviewCount", type: "number", label: "Number of Reviews" },
  { name: "images", type: "images", label: "Service Photos", max: 12 }
]);

// Professional Services
const professionalServicesFormFields = JSON.stringify([
  { name: "qualificationCert", type: "text", label: "Professional License/Certification" },
  { name: "yearsInBusiness", type: "number", label: "Years in Business" },
  { name: "insurance", type: "boolean", label: "Professional Liability Insurance" }
]);

// Home Services
const homeServicesFormFields = JSON.stringify([
  { name: "serviceRadius", type: "number", label: "Service Radius (km)" },
  { name: "toolsIncluded", type: "boolean", label: "Tools & Materials Included" },
  { name: "cleanupIncluded", type: "boolean", label: "Cleanup Included" }
]);

// ============================================
// 6. RENTALS (rentals) - 9 sub-categories
// ============================================
const rentalsFormFields = JSON.stringify([
  { name: "rentalType", type: "select", label: "Property Type", required: true, options: ["Apartment", "House", "Room", "Office", "Shop", "Warehouse", "Vacation", "Land", "Other"] },
  { name: "rentAmount", type: "number", label: "Rent Amount", required: true, min: 0 },
  { name: "rentCurrency", type: "select", label: "Currency", options: ["USD", "IDR", "AUD", "EUR", "GBP", "SGD"] },
  { name: "rentPeriod", type: "select", label: "Rent Period", required: true, options: ["day", "week", "month", "year"] },
  { name: "bondAmount", type: "number", label: "Bond/Security Deposit" },
  { name: "bondMonths", type: "number", label: "Bond (months)", min: 0, max: 12 },
  { name: "billsIncluded", type: "multi-select", label: "Bills Included", options: ["Electricity", "Water", "Internet", "Gas", "TV/Cable", "Management Fees", "None"] },
  { name: "minRentalPeriod", type: "number", label: "Minimum Rental Period", min: 1 },
  { name: "minRentalUnit", type: "select", label: "Minimum Period Unit", options: ["days", "weeks", "months", "years"] },
  { name: "availableFrom", type: "date", label: "Available From", required: true },
  { name: "availableTo", type: "date", label: "Available To" },
  { name: "bedrooms", type: "number", label: "Bedrooms", min: 0 },
  { name: "bathrooms", type: "number", label: "Bathrooms", min: 0, max: 10 },
  { name: "parkingSpaces", type: "number", label: "Parking Spaces", min: 0 },
  { name: "furnished", type: "select", label: "Furnished", options: ["Unfurnished", "Partially Furnished", "Fully Furnished"] },
  { name: "petFriendly", type: "boolean", label: "Pet Friendly" },
  { name: "smokingAllowed", type: "boolean", label: "Smoking Allowed" },
  { name: "amenities", type: "multi-select", label: "Amenities", options: ["WiFi", "Air Conditioning", "Heating", "Hot Water", "Washing Machine", "Refrigerator", "TV", "Gym", "Pool", "Security", "Elevator/Lift", "Garden", "Balcony", "Wheelchair Access"] },
  { name: "location", type: "text", label: "Location/Address", required: true },
  { name: "city", type: "text", label: "City" },
  { name: "proximityTo", type: "text", label: "Near (schools, hospitals, etc.)" },
  { name: "houseRules", type: "textarea", label: "House Rules" },
  { name: "maxOccupants", type: "number", label: "Maximum Occupants", min: 1 },
  { name: "images", type: "images", label: "Photos", max: 16 }
]);

// Offices
const officesFormFields = JSON.stringify([
  { name: "floorLevel", type: "number", label: "Floor Level" },
  { name: "totalFloors", type: "number", label: "Total Floors in Building" },
  { name: "workspaceArea", type: "number", label: "Workspace Area (m²)" },
  { name: "meetingRooms", type: "number", label: "Meeting Rooms" },
  { name: "receptionist", type: "boolean", label: "Receptionist Service" },
  { name: "internetIncluded", type: "boolean", label: "Internet Included" },
  { name: "phoneSystem", type: "boolean", label: "Phone System Available" }
]);

// Vacation Rentals
const vacationRentalsFormFields = JSON.stringify([
  { name: "minStay", type: "number", label: "Minimum Stay (nights)", min: 1 },
  { name: "maxGuests", type: "number", label: "Maximum Guests", min: 1 },
  { name: "checkInTime", type: "text", label: "Check-in Time" },
  { name: "checkOutTime", type: "text", label: "Check-out Time" },
  { name: "poolAccess", type: "boolean", label: "Pool Access" },
  { name: "beachAccess", type: "boolean", label: "Beach Access" },
  { name: "cleaningFee", type: "number", label: "Cleaning Fee" },
  { name: "cancellationPolicy", type: "select", label: "Cancellation Policy", options: ["Flexible", "Moderate", "Strict", "Non-refundable"] }
]);

// ============================================
// 7. WANTED (wanted) - 7 sub-categories (no specific fields)
// ============================================
const wantedFormFields = JSON.stringify([
  { name: "wantedType", type: "select", label: "Looking For", required: true, options: ["Item", "Vehicle", "Property", "Service", "Job", "Roommate", "Space"] },
  { name: "title", type: "text", label: "What Are You Looking For", required: true },
  { name: "budgetMin", type: "number", label: "Min Budget", min: 0 },
  { name: "budgetMax", type: "number", label: "Max Budget", min: 0 },
  { name: "budgetCurrency", type: "select", label: "Currency", options: ["USD", "IDR", "AUD", "EUR", "GBP", "SGD"] },
  { name: "negotiable", type: "boolean", label: "Budget Flexible" },
  { name: "condition", type: "select", label: "Preferred Condition", options: ["Any", "New", "Like New", "Excellent", "Good", "Fair"] },
  { name: "brandPreference", type: "text", label: "Brand Preference" },
  { name: "modelPreference", type: "text", label: "Model/Type Preference" },
  { name: "location", type: "text", label: "Preferred Location" },
  { name: "willingToTravel", type: "boolean", label: "Willing to Travel" },
  { name: "travelDistance", type: "text", label: "Max Travel Distance" },
  { name: "urgency", type: "select", label: "Urgency", options: ["Flexible", "Within 1 Month", "Soon", "Urgent", "ASAP"] },
  { name: "neededBy", type: "date", label: "Needed By" },
  { name: "description", type: "textarea", label: "Details/Requirements" },
  { name: "images", type: "images", label: "Reference Images", max: 5 },
  { name: "contactPreference", type: "select", label: "Contact Preference", options: ["Phone", "WhatsApp", "Email", "In Person", "Any"] },
  { name: "contactPhone", type: "text", label: "Phone" },
  { name: "contactEmail", type: "email", label: "Email" },
  { name: "contactWhatsApp", type: "text", label: "WhatsApp" }
]);

// ============================================
// 8. COMMUNITY (community) - 7 sub-categories + 5 Events sub-categories
// ============================================

// Events & Activities
const eventsActivitiesFormFields = JSON.stringify([
  { name: "eventName", type: "text", label: "Event Name", required: true },
  { name: "eventType", type: "select", label: "Event Type", required: true, options: ["Concert/Performance", "Workshop/Class", "Conference/Seminar", "Festival/Fair", "Sports Event", "Community Meetup", "Market/Bazaar", "Exhibition", "Other"] },
  { name: "eventDate", type: "date", label: "Event Date", required: true },
  { name: "eventTime", type: "text", label: "Start Time", placeholder: "e.g., 7:00 PM" },
  { name: "eventEndDate", type: "date", label: "End Date" },
  { name: "duration", type: "text", label: "Duration", placeholder: "e.g., 3 hours" },
  { name: "recurring", type: "select", label: "Recurring", options: ["One-time", "Daily", "Weekly", "Bi-weekly", "Monthly"] },
  { name: "venue", type: "text", label: "Venue/Location", required: true },
  { name: "city", type: "text", label: "City" },
  { name: "virtualEvent", type: "boolean", label: "Virtual/Online Event" },
  { name: "meetingLink", type: "url", label: "Virtual Meeting Link" },
  { name: "ticketRequired", type: "boolean", label: "Ticket Required" },
  { name: "ticketPrice", type: "number", label: "Ticket Price", min: 0 },
  { name: "freeEntry", type: "boolean", label: "Free Entry" },
  { name: "ticketsAvailable", type: "number", label: "Tickets Available" },
  { name: "organizerName", type: "text", label: "Organizer" },
  { name: "organizerContact", type: "text", label: "Organizer Contact" },
  { name: "ageRestriction", type: "text", label: "Age Restriction", placeholder: "e.g., 18+, All Ages" },
  { name: "dressCode", type: "text", label: "Dress Code" },
  { name: "description", type: "textarea", label: "Event Description" },
  { name: "images", type: "images", label: "Event Images", max: 8 }
]);

// Lost & Found
const lostFoundFormFields = JSON.stringify([
  { name: "itemType", type: "select", label: "Type", required: true, options: ["Lost Item", "Found Item", "Lost Pet"] },
  { name: "category", type: "text", label: "Item Category", placeholder: "e.g., Phone, Wallet, Keys" },
  { name: "lostDate", type: "date", label: "Lost Date" },
  { name: "foundDate", type: "date", label: "Found Date" },
  { name: "location", type: "text", label: "Location", required: true },
  { name: "color", type: "text", label: "Color" },
  { name: "brand", type: "text", label: "Brand" },
  { name: "distinguishingFeatures", type: "textarea", label: "Distinguishing Features" },
  { name: "reward", type: "boolean", label: "Reward Offered" },
  { name: "rewardAmount", type: "number", label: "Reward Amount" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "images", type: "images", label: "Photos", max: 5 },
  { name: "contactPhone", type: "text", label: "Contact Phone" },
  { name: "contactEmail", type: "email", label: "Contact Email" }
]);

// ============================================
// 9. PETS & ANIMALS (pets-animals) - 10 sub-categories
// ============================================
const petsAnimalsFormFields = JSON.stringify([
  { name: "petType", type: "select", label: "Pet Type", required: true, options: ["Dog", "Cat", "Bird", "Fish", "Reptile", "Rabbit", "Hamster", "Guinea Pig", "Horse", "Farm Animal", "Other"] },
  { name: "breed", type: "text", label: "Breed" },
  { name: "mixedBreed", type: "boolean", label: "Mixed Breed" },
  { name: "name", type: "text", label: "Name (if named)" },
  { name: "age", type: "select", label: "Age", required: true, options: ["Baby (0-6 months)", "Young (6-12 months)", "Adult (1-8 years)", "Senior (8+ years)"] },
  { name: "ageMonths", type: "number", label: "Age in Months (if known)", min: 0 },
  { name: "gender", type: "select", label: "Gender", required: true, options: ["Male", "Female", "Unknown"] },
  { name: "size", type: "select", label: "Size", options: ["Toy", "Small", "Medium", "Large", "Giant"] },
  { name: "vaccinated", type: "boolean", label: "Vaccinated" },
  { name: "vaccinationRecords", type: "boolean", label: "Vaccination Records Available" },
  { name: "dewormed", type: "boolean", label: "Dewormed" },
  { name: "spayedNeutered", type: "boolean", label: "Spayed/Neutered" },
  { name: "microchipped", type: "boolean", label: "Microchipped" },
  { name: "microchipNumber", type: "text", label: "Microchip Number" },
  { name: "registrationPapers", type: "boolean", label: "Registration Papers Available" },
  { name: "pedigree", type: "boolean", label: "Pedigree/Show Quality" },
  { name: "healthIssues", type: "textarea", label: "Health Issues/Special Needs" },
  { name: "listingType", type: "select", label: "Listing Type", required: true, options: ["For Sale", "Free to Good Home", "For Adoption", "Stud Service", "Lost", "Found", "For Hire"] },
  { name: "rehomingFee", type: "number", label: "Rehoming Fee" },
  { name: "reasonForRehoming", type: "textarea", label: "Reason for Rehoming" },
  { name: "temperament", type: "multi-select", label: "Temperament", options: ["Friendly", "Shy", "Playful", "Calm", "Energetic", "Good with Kids", "Good with Dogs", "Good with Cats", "House Trained", "Crate Trained", "Leash Trained"] },
  { name: "specialNeeds", type: "textarea", label: "Special Needs/Requirements" },
  { name: "images", type: "images", label: "Photos", max: 12 },
  { name: "location", type: "text", label: "Location", required: true },
  { name: "adoptRequirements", type: "textarea", label: "Adoption Requirements" }
]);

// ============================================
// 10. AGRICULTURE (agriculture) - 7 sub-categories
// ============================================
const agricultureFormFields = JSON.stringify([
  { name: "agriType", type: "select", label: "Type", required: true, options: ["Crops", "Livestock", "Equipment", "Seeds", "Fertilizer", "Fish", "Other"] },
  { name: "title", type: "text", label: "Title", required: true },
  { name: "price", type: "number", label: "Price", required: true, min: 0 },
  { name: "negotiable", type: "boolean", label: "Negotiable" },
  { name: "pricePerUnit", type: "text", label: "Price Per Unit", placeholder: "e.g., per kg, per head" },
  { name: "quantity", type: "number", label: "Total Quantity" },
  { name: "unit", type: "text", label: "Unit", placeholder: "e.g., kg, head, piece" },
  { name: "availableQuantity", type: "number", label: "Currently Available" },
  { name: "quality", type: "select", label: "Quality", options: ["Premium", "Grade A", "Grade B", "Standard", "For Processing"] },
  { name: "organic", type: "boolean", label: "Organic/Organic Certified" },
  { name: "certification", type: "text", label: "Certifications" },
  { name: "soilType", type: "select", label: "Soil Type", options: ["Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky", "Not Applicable"] },
  { name: "climateZone", type: "text", label: "Climate Zone" },
  { name: "location", type: "text", label: "Farm Location" },
  { name: "deliveryAvailable", type: "boolean", label: "Delivery Available" },
  { name: "deliveryArea", type: "text", label: "Delivery Area" },
  { name: "description", type: "textarea", label: "Description" },
  { name: "images", type: "images", label: "Photos", max: 12 }
]);

// Crops & Produce
const cropsProduceFormFields = JSON.stringify([
  { name: "cropType", type: "text", label: "Crop Type" },
  { name: "harvestDate", type: "date", label: "Harvest Date" },
  { name: "plantingDate", type: "date", label: "Planting Date" },
  { name: "expectedYield", type: "text", label: "Expected Yield" },
  { name: "irrigationType", type: "select", label: "Irrigation", options: ["Rain-fed", "Drip", "Sprinkler", "Flood", "Manual"] },
  { name: "pesticideFree", type: "boolean", label: "Pesticide Free" },
  { name: "packaging", type: "text", label: "Packaging Type" }
]);

// Farm Equipment
const farmEquipmentFormFields = JSON.stringify([
  { name: "brand", type: "text", label: "Brand" },
  { name: "model", type: "text", label: "Model" },
  { name: "year", type: "number", label: "Year", min: 1950 },
  { name: "hoursUsed", type: "number", label: "Hours Used" },
  { name: "operatingCondition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Needs Repair", "For Parts"] },
  { name: "warranty", type: "boolean", label: "Warranty Available" },
  { name: "sparePartsAvailable", type: "boolean", label: "Spare Parts Available" },
  { name: "deliveryAvailable", type: "boolean", label: "Delivery Available" }
]);

// ============================================
// COMPLETE CATEGORIES ARRAY
// ============================================
export const listingCategories = [
  // ========================
  // TOP-LEVEL CATEGORIES
  // ========================
  {
    id: 'vehicles',
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, motorcycles, boats, and other vehicles',
    icon: '🚗',
    parentId: null,
    sortOrder: 1,
    isActive: 1,
    formFields: vehiclesFormFields
  },
  {
    id: 'property-sale',
    name: 'Property Sale',
    slug: 'property-sale',
    description: 'Real estate for sale',
    icon: '🏠',
    parentId: null,
    sortOrder: 2,
    isActive: 1,
    formFields: propertySaleFormFields
  },
  {
    id: 'for-sale',
    name: 'For Sale',
    slug: 'for-sale',
    description: 'Items for sale by individuals and businesses',
    icon: '🛒',
    parentId: null,
    sortOrder: 3,
    isActive: 1,
    formFields: forSaleFormFields
  },
  {
    id: 'jobs',
    name: 'Jobs',
    slug: 'jobs',
    description: 'Employment opportunities and job postings',
    icon: '💼',
    parentId: null,
    sortOrder: 4,
    isActive: 1,
    formFields: jobsFormFields
  },
  {
    id: 'services',
    name: 'Services',
    slug: 'services',
    description: 'Professional and personal services',
    icon: '🔧',
    parentId: null,
    sortOrder: 5,
    isActive: 1,
    formFields: servicesFormFields
  },
  {
    id: 'rentals',
    name: 'Rentals',
    slug: 'rentals',
    description: 'Property and equipment for rent',
    icon: '🔑',
    parentId: null,
    sortOrder: 6,
    isActive: 1,
    formFields: rentalsFormFields
  },
  {
    id: 'wanted',
    name: 'Wanted',
    slug: 'wanted',
    description: 'Items or services people are looking for',
    icon: '🔍',
    parentId: null,
    sortOrder: 7,
    isActive: 1,
    formFields: wantedFormFields
  },
  {
    id: 'community',
    name: 'Community',
    slug: 'community',
    description: 'Events, lost & found, free items, and community activities',
    icon: '🎭',
    parentId: null,
    sortOrder: 8,
    isActive: 1,
    formFields: JSON.stringify([{ name: "description", type: "textarea", label: "Description" }])
  },
  {
    id: 'pets-animals',
    name: 'Pets & Animals',
    slug: 'pets-animals',
    description: 'Pets for sale, adoption, or looking for home',
    icon: '🐾',
    parentId: null,
    sortOrder: 9,
    isActive: 1,
    formFields: petsAnimalsFormFields
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Farm products, livestock, and agricultural equipment',
    icon: '🌾',
    parentId: null,
    sortOrder: 10,
    isActive: 1,
    formFields: agricultureFormFields
  },

  // ========================
  // VEHICLES SUB-CATEGORIES
  // ========================
  {
    id: 'cars-suvs',
    name: 'Cars & SUVs',
    slug: 'cars-suvs',
    description: 'Cars and passenger vehicles',
    icon: '🚙',
    parentId: 'vehicles',
    sortOrder: 11,
    isActive: 1,
    formFields: carsSuvsFormFields
  },
  {
    id: 'motorcycles',
    name: 'Motorcycles & Scooters',
    slug: 'motorcycles',
    description: 'Motorcycles and scooters',
    icon: '🏍️',
    parentId: 'vehicles',
    sortOrder: 12,
    isActive: 1,
    formFields: motorcyclesFormFields
  },
  {
    id: 'bicycles',
    name: 'Bicycles',
    slug: 'bicycles',
    description: 'Bicycles of all types',
    icon: '🚲',
    parentId: 'vehicles',
    sortOrder: 13,
    isActive: 1,
    formFields: bicyclesFormFields
  },
  {
    id: 'vans-trucks',
    name: 'Vans & Trucks',
    slug: 'vans-trucks',
    description: 'Commercial vehicles and trucks',
    icon: '🚚',
    parentId: 'vehicles',
    sortOrder: 14,
    isActive: 1,
    formFields: vansTrucksFormFields
  },
  {
    id: 'boats-marine',
    name: 'Boats & Marine',
    slug: 'boats-marine',
    description: 'Boats, yachts, and marine equipment',
    icon: '⛵',
    parentId: 'vehicles',
    sortOrder: 15,
    isActive: 1,
    formFields: boatsMarineFormFields
  },
  {
    id: 'rvs-campers',
    name: 'RVs & Campers',
    slug: 'rvs-campers',
    description: 'Recreational vehicles and campers',
    icon: '🚐',
    parentId: 'vehicles',
    sortOrder: 16,
    isActive: 1,
    formFields: rvsCampersFormFields
  },
  {
    id: 'vehicle-parts',
    name: 'Parts & Accessories',
    slug: 'vehicle-parts',
    description: 'Vehicle parts and accessories',
    icon: '⚙️',
    parentId: 'vehicles',
    sortOrder: 17,
    isActive: 1,
    formFields: vehiclePartsFormFields
  },
  {
    id: 'agri-vehicles',
    name: 'Agricultural Vehicles',
    slug: 'agri-vehicles',
    description: 'Tractors and farm vehicles',
    icon: '🚜',
    parentId: 'vehicles',
    sortOrder: 18,
    isActive: 1,
    formFields: agriVehiclesFormFields
  },
  {
    id: 'other-vehicles',
    name: 'Other Vehicles',
    slug: 'other-vehicles',
    description: 'Other types of vehicles',
    icon: '🛺',
    parentId: 'vehicles',
    sortOrder: 19,
    isActive: 1,
    formFields: JSON.stringify([{ name: "vehicleType", type: "text", label: "Vehicle Type" }])
  },

  // ========================
  // PROPERTY SALE SUB-CATEGORIES
  // ========================
  {
    id: 'houses-villas',
    name: 'Houses & Villas',
    slug: 'houses-villas',
    description: 'Houses and villas for sale',
    icon: '🏡',
    parentId: 'property-sale',
    sortOrder: 21,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'apartments-condos',
    name: 'Apartments & Condos',
    slug: 'apartments-condos',
    description: 'Apartments and condos for sale',
    icon: '🏢',
    parentId: 'property-sale',
    sortOrder: 22,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "floorLevel", type: "number", label: "Floor Level" },
      { name: "totalFloors", type: "number", label: "Total Floors" },
      { name: "hasLift", type: "boolean", label: "Has Elevator/Lift" }
    ])
  },
  {
    id: 'townhouses',
    name: 'Townhouses',
    slug: 'townhouses',
    description: 'Townhouses for sale',
    icon: '🏘️',
    parentId: 'property-sale',
    sortOrder: 23,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "totalUnits", type: "number", label: "Total Units in Complex" },
      { name: "communityFees", type: "number", label: "Community Fees" }
    ])
  },
  {
    id: 'duplexes',
    name: 'Duplexes',
    slug: 'duplexes',
    description: 'Duplexes for sale',
    icon: '🏠',
    parentId: 'property-sale',
    sortOrder: 24,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "separateEntrances", type: "number", label: "Number of Separate Entrances" }
    ])
  },
  {
    id: 'land-plots',
    name: 'Land & Plots',
    slug: 'land-plots',
    description: 'Land and plots for sale',
    icon: '🏔️',
    parentId: 'property-sale',
    sortOrder: 25,
    isActive: 1,
    formFields: landPlotsFormFields
  },
  {
    id: 'commercial-buildings',
    name: 'Commercial Buildings',
    slug: 'commercial-buildings',
    description: 'Commercial properties for sale',
    icon: '🏬',
    parentId: 'property-sale',
    sortOrder: 26,
    isActive: 1,
    formFields: commercialBuildingsFormFields
  },
  {
    id: 'industrial-buildings',
    name: 'Industrial Buildings',
    slug: 'industrial-buildings',
    description: 'Industrial properties for sale',
    icon: '🏭',
    parentId: 'property-sale',
    sortOrder: 27,
    isActive: 1,
    formFields: industrialBuildingsFormFields
  },
  {
    id: 'other-property',
    name: 'Other Property',
    slug: 'other-property',
    description: 'Other types of property for sale',
    icon: '🏗️',
    parentId: 'property-sale',
    sortOrder: 28,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // FOR SALE SUB-CATEGORIES
  // ========================
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    description: 'Phones, computers, and gadgets',
    icon: '📱',
    parentId: 'for-sale',
    sortOrder: 31,
    isActive: 1,
    formFields: electronicsFormFields
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    icon: '👗',
    parentId: 'for-sale',
    sortOrder: 32,
    isActive: 1,
    formFields: fashionFormFields
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home and garden items',
    icon: '🪴',
    parentId: 'for-sale',
    sortOrder: 33,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "furnitureType", type: "select", label: "Furniture Type", options: ["Sofa", "Bed", "Table", "Chair", "Cabinet", "Desk", "Storage", "Outdoor", "Other"] },
      { name: "roomType", type: "select", label: "Room Type", options: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Outdoor", "Other"] },
      { name: "style", type: "select", label: "Style", options: ["Modern", "Traditional", "Vintage", "Minimalist", "Industrial", "Bohemian", "Scandinavian", "Other"] },
      { name: "material", type: "text", label: "Material" },
      { name: "dimensions", type: "text", label: "Dimensions (L x W x H cm)" }
    ])
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports gear and outdoor equipment',
    icon: '⚽',
    parentId: 'for-sale',
    sortOrder: 34,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "sportType", type: "select", label: "Sport/Activity", options: ["Football", "Basketball", "Tennis", "Swimming", "Cycling", "Gym/Fitness", "Hiking", "Camping", "Water Sports", "Winter Sports", "Martial Arts", "Other"] },
      { name: "usedFor", type: "select", label: "Used For", options: ["Indoor", "Outdoor", "Both"] },
      { name: "skillLevel", type: "select", label: "Skill Level", options: ["Beginner", "Intermediate", "Advanced", "Professional"] }
    ])
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    slug: 'baby-kids',
    description: 'Baby and kids items',
    icon: '👶',
    parentId: 'for-sale',
    sortOrder: 35,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "ageRange", type: "select", label: "Age Range", options: ["0-6 months", "6-12 months", "1-2 years", "2-4 years", "4-6 years", "6-8 years", "8-12 years", "12+ years"] },
      { name: "gender", type: "select", label: "Gender", options: ["Boys", "Girls", "Unisex"] },
      { name: "safetyCertified", type: "boolean", label: "Safety Certified" }
    ])
  },
  {
    id: 'books-education',
    name: 'Books & Education',
    slug: 'books-education',
    description: 'Books, textbooks, and educational materials',
    icon: '📚',
    parentId: 'for-sale',
    sortOrder: 36,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "bookFormat", type: "select", label: "Format", options: ["Hardcover", "Paperback", "E-Book", "Audiobook"] },
      { name: "genre", type: "text", label: "Genre/Subject" },
      { name: "author", type: "text", label: "Author" },
      { name: "isbn", type: "text", label: "ISBN" },
      { name: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Poor"] }
    ])
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Health and beauty products',
    icon: '💄',
    parentId: 'for-sale',
    sortOrder: 37,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "skinType", type: "select", label: "Skin Type", options: ["Normal", "Dry", "Oily", "Combination", "Sensitive", "All Skin Types"] },
      { name: "brand", type: "text", label: "Brand" },
      { name: "expiryDate", type: "date", label: "Expiry Date" },
      { name: "organic", type: "boolean", label: "Organic/Natural" },
      { name: "sealed", type: "boolean", label: "Sealed/Unopened" }
    ])
  },
  {
    id: 'office-business',
    name: 'Office & Business',
    slug: 'office-business',
    description: 'Office equipment and business supplies',
    icon: '💼',
    parentId: 'for-sale',
    sortOrder: 38,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "businessType", type: "select", label: "Business Type", options: ["Office Furniture", "Office Equipment", "Point of Sale", "Restaurant Equipment", "Medical Equipment", "Industrial Equipment", "Other"] }
    ])
  },
  {
    id: 'industrial-equipment',
    name: 'Industrial Equipment',
    slug: 'industrial-equipment',
    description: 'Industrial and commercial equipment',
    icon: '🏗️',
    parentId: 'for-sale',
    sortOrder: 39,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "operatingCondition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Needs Repair", "For Parts"] },
      { name: "voltage", type: "text", label: "Voltage/Power" },
      { name: "powerRating", type: "text", label: "Power Rating" },
      { name: "certification", type: "text", label: "Certification/Standard" }
    ])
  },
  {
    id: 'musical-instruments',
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    description: 'Musical instruments and equipment',
    icon: '🎸',
    parentId: 'for-sale',
    sortOrder: 40,
    isActive: 1,
    formFields: musicalInstrumentsFormFields
  },
  {
    id: 'art-antiques',
    name: 'Art & Antiques',
    slug: 'art-antiques',
    description: 'Art, antiques, and collectibles',
    icon: '🎨',
    parentId: 'for-sale',
    sortOrder: 41,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "artType", type: "select", label: "Art Type", options: ["Painting", "Sculpture", "Photography", "Print", "Drawing", "Digital Art", "Antique", "Collectible", "Handcraft", "Jewelry", "Other"] },
      { name: "period", type: "text", label: "Period/Era" },
      { name: "artist", type: "text", label: "Artist/Creator" },
      { name: "dimensions", type: "text", label: "Dimensions" },
      { name: "authenticity", type: "select", label: "Authenticity", options: ["Original", "Limited Edition", "Print/Reproduction", "Vintage Copy", "Unknown"] }
    ])
  },
  {
    id: 'other-items',
    name: 'Other Items',
    slug: 'other-items',
    description: 'Other items for sale',
    icon: '📦',
    parentId: 'for-sale',
    sortOrder: 42,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // JOBS SUB-CATEGORIES
  // ========================
  {
    id: 'full-time',
    name: 'Full-time',
    slug: 'full-time',
    description: 'Full-time employment',
    icon: '💼',
    parentId: 'jobs',
    sortOrder: 51,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'part-time',
    name: 'Part-time',
    slug: 'part-time',
    description: 'Part-time employment',
    icon: '⏰',
    parentId: 'jobs',
    sortOrder: 52,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'contract',
    name: 'Contract',
    slug: 'contract',
    description: 'Contract employment',
    icon: '📝',
    parentId: 'jobs',
    sortOrder: 53,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'internship',
    name: 'Internship',
    slug: 'internship',
    description: 'Internship positions',
    icon: '🎓',
    parentId: 'jobs',
    sortOrder: 54,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'freelance',
    name: 'Freelance',
    slug: 'freelance',
    description: 'Freelance opportunities',
    icon: '💻',
    parentId: 'jobs',
    sortOrder: 55,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'remote',
    name: 'Remote / Work from Home',
    slug: 'remote',
    description: 'Remote and work-from-home jobs',
    icon: '🏠',
    parentId: 'jobs',
    sortOrder: 56,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'seasonal',
    name: 'Seasonal / Temporary',
    slug: 'seasonal',
    description: 'Seasonal and temporary positions',
    icon: '❄️',
    parentId: 'jobs',
    sortOrder: 57,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // SERVICES SUB-CATEGORIES
  // ========================
  {
    id: 'professional-services',
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Legal, accounting, consulting',
    icon: '💼',
    parentId: 'services',
    sortOrder: 61,
    isActive: 1,
    formFields: professionalServicesFormFields
  },
  {
    id: 'home-services',
    name: 'Home Services',
    slug: 'home-services',
    description: 'Repair, cleaning, maintenance',
    icon: '🔧',
    parentId: 'services',
    sortOrder: 62,
    isActive: 1,
    formFields: homeServicesFormFields
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Hair, makeup, spa, massage',
    icon: '💆',
    parentId: 'services',
    sortOrder: 63,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "licensed", type: "boolean", label: "Licensed/Certified" },
      { name: "yearsExperience", type: "number", label: "Years of Experience" }
    ])
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    slug: 'education-training',
    description: 'Tutoring, lessons, training',
    icon: '📚',
    parentId: 'services',
    sortOrder: 64,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "teachingMode", type: "select", label: "Teaching Mode", options: ["In Person", "Online", "Both"] },
      { name: "hourlyRate", type: "number", label: "Hourly Rate" },
      { name: "qualifications", type: "text", label: "Qualifications" }
    ])
  },
  {
    id: 'events-entertainment',
    name: 'Events & Entertainment',
    slug: 'events-entertainment',
    description: 'Photography, DJ, event planning',
    icon: '🎤',
    parentId: 'services',
    sortOrder: 65,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "eventType", type: "multi-select", label: "Event Types", options: ["Wedding", "Birthday", "Corporate", "Concert", "Conference", "Private Party", "Other"] },
      { name: "equipment", type: "text", label: "Equipment Available" }
    ])
  },
  {
    id: 'transport-logistics',
    name: 'Transport & Logistics',
    slug: 'transport-logistics',
    description: 'Moving, delivery, taxi',
    icon: '🚛',
    parentId: 'services',
    sortOrder: 66,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "vehicleTypes", type: "multi-select", label: "Vehicle Types", options: ["Car", "Van", "Truck", "Motorcycle", "Bicycle", "Other"] },
      { name: "serviceArea", type: "text", label: "Service Area" }
    ])
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    slug: 'pet-services',
    description: 'Pet sitting, grooming, vet',
    icon: '🐕',
    parentId: 'services',
    sortOrder: 67,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "petTypes", type: "multi-select", label: "Pet Types", options: ["Dogs", "Cats", "Birds", "Fish", "Reptiles", "Small Pets", "All Pets"] },
      { name: "serviceType", type: "multi-select", label: "Services", options: ["Grooming", "Boarding", "Day Care", "Walking", "Training", "Veterinary", "Other"] }
    ])
  },
  {
    id: 'other-services',
    name: 'Other Services',
    slug: 'other-services',
    description: 'Other services',
    icon: '🛠️',
    parentId: 'services',
    sortOrder: 68,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // RENTALS SUB-CATEGORIES
  // ========================
  {
    id: 'apartments-flats',
    name: 'Apartments & Flats',
    slug: 'apartments-flats',
    description: 'Apartments and flats for rent',
    icon: '🏢',
    parentId: 'rentals',
    sortOrder: 71,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "floorLevel", type: "number", label: "Floor Level" },
      { name: "totalFloors", type: "number", label: "Total Floors in Building" }
    ])
  },
  {
    id: 'houses-villas-rental',
    name: 'Houses & Villas',
    slug: 'houses-villas-rental',
    description: 'Houses and villas for rent',
    icon: '🏡',
    parentId: 'rentals',
    sortOrder: 72,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "gardenSize", type: "number", label: "Garden Size (m²)" }
    ])
  },
  {
    id: 'rooms',
    name: 'Rooms',
    slug: 'rooms',
    description: 'Rooms for rent',
    icon: '🛏️',
    parentId: 'rentals',
    sortOrder: 73,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "roommateCount", type: "number", label: "Current Roommates" },
      { name: "furnished", type: "select", label: "Furnished", options: ["Unfurnished", "Partially Furnished", "Fully Furnished"] }
    ])
  },
  {
    id: 'offices',
    name: 'Offices',
    slug: 'offices',
    description: 'Office space for rent',
    icon: '🏢',
    parentId: 'rentals',
    sortOrder: 74,
    isActive: 1,
    formFields: officesFormFields
  },
  {
    id: 'shops-retail',
    name: 'Shops & Retail Space',
    slug: 'shops-retail',
    description: 'Retail space for rent',
    icon: '🏪',
    parentId: 'rentals',
    sortOrder: 75,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "shopFront", type: "text", label: "Shop Front Width (m)" },
      { name: "storageArea", type: "number", label: "Storage Area (m²)" },
      { name: "licenseIncluded", type: "boolean", label: "Business License Included" },
      { name: "peakHours", type: "text", label: "Peak Trading Hours" }
    ])
  },
  {
    id: 'warehouses-storage',
    name: 'Warehouses & Storage',
    slug: 'warehouses-storage',
    description: 'Warehouses and storage space',
    icon: '📦',
    parentId: 'rentals',
    sortOrder: 76,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "clearHeight", type: "number", label: "Clear Height (m)" },
      { name: "securitySystem", type: "boolean", label: "Security System" },
      { name: "loadingDock", type: "boolean", label: "Loading Dock" }
    ])
  },
  {
    id: 'vacation-rentals',
    name: 'Vacation Rentals',
    slug: 'vacation-rentals',
    description: 'Short-term vacation rentals',
    icon: '🏖️',
    parentId: 'rentals',
    sortOrder: 77,
    isActive: 1,
    formFields: vacationRentalsFormFields
  },
  {
    id: 'land-rental',
    name: 'Land',
    slug: 'land-rental',
    description: 'Land for rent',
    icon: '🏔️',
    parentId: 'rentals',
    sortOrder: 78,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "landUseType", type: "select", label: "Land Use", options: ["Agricultural", "Commercial", "Industrial", "Recreational"] }
    ])
  },
  {
    id: 'other-rentals',
    name: 'Other Rentals',
    slug: 'other-rentals',
    description: 'Other rentals',
    icon: '🏠',
    parentId: 'rentals',
    sortOrder: 79,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // WANTED SUB-CATEGORIES
  // ========================
  {
    id: 'items-wanted',
    name: 'Items Wanted',
    slug: 'items-wanted',
    description: 'Items you are looking for',
    icon: '🛍️',
    parentId: 'wanted',
    sortOrder: 81,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'vehicles-wanted',
    name: 'Vehicles Wanted',
    slug: 'vehicles-wanted',
    description: 'Vehicles you are looking for',
    icon: '🚗',
    parentId: 'wanted',
    sortOrder: 82,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'property-wanted',
    name: 'Property Wanted',
    slug: 'property-wanted',
    description: 'Property you are looking for',
    icon: '🏠',
    parentId: 'wanted',
    sortOrder: 83,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'services-needed',
    name: 'Services Needed',
    slug: 'services-needed',
    description: 'Services you are looking for',
    icon: '🔧',
    parentId: 'wanted',
    sortOrder: 84,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'jobs-wanted',
    name: 'Jobs Wanted',
    slug: 'jobs-wanted',
    description: 'Job opportunities you are looking for',
    icon: '💼',
    parentId: 'wanted',
    sortOrder: 85,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'roommate-wanted',
    name: 'Roommate Wanted',
    slug: 'roommate-wanted',
    description: 'Looking for a roommate',
    icon: '👥',
    parentId: 'wanted',
    sortOrder: 86,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'space-wanted',
    name: 'Space Wanted',
    slug: 'space-wanted',
    description: 'Space you are looking for',
    icon: '📍',
    parentId: 'wanted',
    sortOrder: 87,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // COMMUNITY SUB-CATEGORIES
  // ========================
  {
    id: 'events-activities',
    name: 'Events & Activities',
    slug: 'events-activities',
    description: 'Concerts, workshops, and community events',
    icon: '🎭',
    parentId: 'community',
    sortOrder: 91,
    isActive: 1,
    formFields: eventsActivitiesFormFields
  },
  {
    id: 'lost-found',
    name: 'Lost & Found',
    slug: 'lost-found',
    description: 'Lost and found items',
    icon: '🔎',
    parentId: 'community',
    sortOrder: 92,
    isActive: 1,
    formFields: lostFoundFormFields
  },
  {
    id: 'free-items',
    name: 'Free Items',
    slug: 'free-items',
    description: 'Items for free',
    icon: '🎁',
    parentId: 'community',
    sortOrder: 93,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "category", type: "select", label: "Category", options: ["Furniture", "Electronics", "Clothing", "Books", "Kitchen", "Garden", "Baby Items", "Sports", "Other"] },
      { name: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Poor"] },
      { name: "pickupOnly", type: "boolean", label: "Pickup Only" },
      { name: "location", type: "text", label: "Location" }
    ])
  },
  {
    id: 'volunteers-charity',
    name: 'Volunteers & Charity',
    slug: 'volunteers-charity',
    description: 'Volunteer opportunities and charity',
    icon: '❤️',
    parentId: 'community',
    sortOrder: 94,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "organizationName", type: "text", label: "Organization Name" },
      { name: "volunteerType", type: "multi-select", label: "Volunteer Type", options: ["On-site", "Remote", "Both"] },
      { name: "timeCommitment", type: "text", label: "Time Commitment" },
      { name: "description", type: "textarea", label: "Description" }
    ])
  },
  {
    id: 'announcements',
    name: 'Announcements',
    slug: 'announcements',
    description: 'Public announcements',
    icon: '📢',
    parentId: 'community',
    sortOrder: 95,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "announcementType", type: "select", label: "Type", options: ["Public Notice", "Community News", "Government", "Business", "Personal"] },
      { name: "validUntil", type: "date", label: "Valid Until" }
    ])
  },
  {
    id: 'discussion-groups',
    name: 'Discussion Groups',
    slug: 'discussion-groups',
    description: 'Discussion groups and forums',
    icon: '💬',
    parentId: 'community',
    sortOrder: 96,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "groupType", type: "select", label: "Group Type", options: ["Buy/Sell Group", "Interest Group", "Neighborhood", "Professional", "Support Group", "Other"] },
      { name: "meetingFrequency", type: "text", label: "Meeting Frequency" }
    ])
  },
  {
    id: 'other-community',
    name: 'Other Community',
    slug: 'other-community',
    description: 'Other community posts',
    icon: '🌐',
    parentId: 'community',
    sortOrder: 97,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // EVENTS SUB-CATEGORIES (under Events & Activities)
  // ========================
  {
    id: 'concerts-shows',
    name: 'Concerts & Shows',
    slug: 'concerts-shows',
    description: 'Concerts and live shows',
    icon: '🎵',
    parentId: 'events-activities',
    sortOrder: 911,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'workshops-classes',
    name: 'Workshops & Classes',
    slug: 'workshops-classes',
    description: 'Educational workshops and classes',
    icon: '🎓',
    parentId: 'events-activities',
    sortOrder: 912,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'sports-events',
    name: 'Sports Events',
    slug: 'sports-events',
    description: 'Sports tournaments and events',
    icon: '🏆',
    parentId: 'events-activities',
    sortOrder: 913,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'festivals-fairs',
    name: 'Festivals & Fairs',
    slug: 'festivals-fairs',
    description: 'Festivals and fair events',
    icon: '🎪',
    parentId: 'events-activities',
    sortOrder: 914,
    isActive: 1,
    formFields: JSON.stringify([])
  },
  {
    id: 'community-meetups',
    name: 'Community Meetups',
    slug: 'community-meetups',
    description: 'Community gathering meetups',
    icon: '👋',
    parentId: 'events-activities',
    sortOrder: 915,
    isActive: 1,
    formFields: JSON.stringify([])
  },

  // ========================
  // PETS & ANIMALS SUB-CATEGORIES
  // ========================
  {
    id: 'dogs',
    name: 'Dogs',
    slug: 'dogs',
    description: 'Dogs for sale or adoption',
    icon: '🐕',
    parentId: 'pets-animals',
    sortOrder: 101,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "breed", type: "text", label: "Breed" },
      { name: "registrationPapers", type: "boolean", label: "Registration Papers" }
    ])
  },
  {
    id: 'cats',
    name: 'Cats',
    slug: 'cats',
    description: 'Cats for sale or adoption',
    icon: '🐈',
    parentId: 'pets-animals',
    sortOrder: 102,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "breed", type: "text", label: "Breed" },
      { name: "indoorOutdoor", type: "select", label: "Indoor/Outdoor", options: ["Indoor", "Outdoor", "Both"] }
    ])
  },
  {
    id: 'birds',
    name: 'Birds',
    slug: 'birds',
    description: 'Birds for sale or adoption',
    icon: '🦜',
    parentId: 'pets-animals',
    sortOrder: 103,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "species", type: "text", label: "Species" },
      { name: "talkingAbility", type: "boolean", label: "Can Talk" }
    ])
  },
  {
    id: 'fish-aquariums',
    name: 'Fish & Aquariums',
    slug: 'fish-aquariums',
    description: 'Fish and aquarium equipment',
    icon: '🐠',
    parentId: 'pets-animals',
    sortOrder: 104,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "tankSize", type: "text", label: "Tank Size (gallons)" },
      { name: "fishSpecies", type: "text", label: "Fish Species" }
    ])
  },
  {
    id: 'reptiles',
    name: 'Reptiles & Amphibians',
    slug: 'reptiles',
    description: 'Reptiles and amphibians',
    icon: '🦎',
    parentId: 'pets-animals',
    sortOrder: 105,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "species", type: "text", label: "Species" },
      { name: "habitatType", type: "text", label: "Habitat Type" }
    ])
  },
  {
    id: 'small-pets',
    name: 'Small Pets',
    slug: 'small-pets',
    description: 'Rabbits, hamsters, guinea pigs',
    icon: '🐹',
    parentId: 'pets-animals',
    sortOrder: 106,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "species", type: "text", label: "Species" }
    ])
  },
  {
    id: 'horses-ponies',
    name: 'Horses & Ponies',
    slug: 'horses-ponies',
    description: 'Horses and ponies',
    icon: '🐴',
    parentId: 'pets-animals',
    sortOrder: 107,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "registered", type: "boolean", label: "Registered" },
      { name: "trainingLevel", type: "select", label: "Training Level", options: ["Unbroken", "Green", "Intermediate", "Advanced", "School Master"] }
    ])
  },
  {
    id: 'farm-animals',
    name: 'Farm Animals',
    slug: 'farm-animals',
    description: 'Cattle, sheep, goats, etc.',
    icon: '🐄',
    parentId: 'pets-animals',
    sortOrder: 108,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "purpose", type: "select", label: "Purpose", options: ["Meat", "Dairy", "Breeding", "Wool", "Guard", "Pet"] },
      { name: "registrationPapers", type: "boolean", label: "Registration Papers" }
    ])
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies & Accessories',
    slug: 'pet-supplies',
    description: 'Pet food, toys, accessories',
    icon: '🦴',
    parentId: 'pets-animals',
    sortOrder: 109,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "petType", type: "select", label: "For Pet Type", options: ["Dog", "Cat", "Bird", "Fish", "Reptile", "Small Pet", "All Pets"] },
      { name: "productType", type: "select", label: "Product Type", options: ["Food", "Toys", "Bedding", "Grooming", "Health", "Accessories", "Equipment"] }
    ])
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    slug: 'pet-services',
    description: 'Grooming, boarding, training',
    icon: '✂️',
    parentId: 'pets-animals',
    sortOrder: 110,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "serviceType", type: "multi-select", label: "Services Offered", options: ["Grooming", "Boarding", "Day Care", "Walking", "Training", "Veterinary", "Pet Sitting", "Other"] }
    ])
  },

  // ========================
  // AGRICULTURE SUB-CATEGORIES
  // ========================
  {
    id: 'crops-produce',
    name: 'Crops & Produce',
    slug: 'crops-produce',
    description: 'Crops and agricultural produce',
    icon: '🌾',
    parentId: 'agriculture',
    sortOrder: 111,
    isActive: 1,
    formFields: cropsProduceFormFields
  },
  {
    id: 'livestock-poultry',
    name: 'Livestock & Poultry',
    slug: 'livestock-poultry',
    description: 'Livestock and poultry',
    icon: '🐔',
    parentId: 'agriculture',
    sortOrder: 112,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "animalType", type: "text", label: "Animal Type" },
      { name: "breed", type: "text", label: "Breed" },
      { name: "gender", type: "select", label: "Gender", options: ["Male", "Female", "Mixed"] },
      { name: "age", type: "text", label: "Age" },
      { name: "weight", type: "number", label: "Weight (kg)" },
      { name: "vaccinated", type: "boolean", label: "Vaccinated" },
      { name: "healthCertificate", type: "boolean", label: "Health Certificate" }
    ])
  },
  {
    id: 'farm-equipment',
    name: 'Farm Equipment',
    slug: 'farm-equipment',
    description: 'Tractors, harvesters, tools',
    icon: '🚜',
    parentId: 'agriculture',
    sortOrder: 113,
    isActive: 1,
    formFields: farmEquipmentFormFields
  },
  {
    id: 'seeds-plants',
    name: 'Seeds & Plants',
    slug: 'seeds-plants',
    description: 'Seeds, seedlings, and plants',
    icon: '🌱',
    parentId: 'agriculture',
    sortOrder: 114,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "seedType", type: "text", label: "Seed/Plant Type" },
      { name: "germinationRate", type: "number", label: "Germination Rate (%)" },
      { name: "purity", type: "number", label: "Purity (%)" },
      { name: "origin", type: "text", label: "Origin/Country" },
      { name: "organic", type: "boolean", label: "Organic" },
      { name: "packaging", type: "text", label: "Packaging Size (kg)" }
    ])
  },
  {
    id: 'fertilizers-chemicals',
    name: 'Fertilizers & Chemicals',
    slug: 'fertilizers-chemicals',
    description: 'Fertilizers and agricultural chemicals',
    icon: '🧪',
    parentId: 'agriculture',
    sortOrder: 115,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "productType", type: "select", label: "Product Type", options: ["Fertilizer", "Pesticide", "Herbicide", "Fungicide", "Soil Amendment", "Other"] },
      { name: "organic", type: "boolean", label: "Organic" },
      { name: "applicationMethod", type: "text", label: "Application Method" },
      { name: "coverageArea", type: "text", label: "Coverage Area" }
    ])
  },
  {
    id: 'fish-aquaculture',
    name: 'Fish & Aquaculture',
    slug: 'fish-aquaculture',
    description: 'Fish and aquaculture products',
    icon: '🐟',
    parentId: 'agriculture',
    sortOrder: 116,
    isActive: 1,
    formFields: JSON.stringify([
      { name: "fishSpecies", type: "text", label: "Fish Species" },
      { name: "weight", type: "number", label: "Average Weight (kg)" },
      { name: "age", type: "text", label: "Age/Maturity" },
      { name: "waterType", type: "select", label: "Water Type", options: ["Freshwater", "Saltwater", "Brackish"] }
    ])
  },
  {
    id: 'other-agricultural',
    name: 'Other Agricultural',
    slug: 'other-agricultural',
    description: 'Other agricultural products',
    icon: '🌾',
    parentId: 'agriculture',
    sortOrder: 117,
    isActive: 1,
    formFields: JSON.stringify([])
  }
];

// SQL Insert Statement Generator
export const insertListingCategoriesSQL = listingCategories.map(cat => `
  INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields)
  VALUES (
    '${cat.id}',
    '${cat.name.replace(/'/g, "''")}',
    '${cat.slug}',
    '${cat.description?.replace(/'/g, "''") || ''}',
    '${cat.icon}',
    ${cat.parentId ? `'${cat.parentId}'` : 'NULL'},
    ${cat.sortOrder},
    ${cat.isActive ? 1 : 0},
    '${cat.formFields.replace(/'/g, "''")}'
  );
`).join('\n');

export default listingCategories;
