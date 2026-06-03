BEGIN TRANSACTION;
DELETE FROM listing_categories;
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('community', 'Community', 'community', 'Events, lost & found, free items, and community activities', '🎭', NULL, 8, 1, '[{ name: "description", type: "textarea", label: "Description" }]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-vehicles', 'Other Vehicles', 'other-vehicles', 'Other types of vehicles', '🛺', '''vehicles''', 19, 1, '[{ name: "vehicleType", type: "text", label: "Vehicle Type" }]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('houses-villas', 'Houses & Villas', 'houses-villas', 'Houses and villas for sale', '🏡', '''property-sale''', 21, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('apartments-condos', 'Apartments & Condos', 'apartments-condos', 'Apartments and condos for sale', '🏢', '''property-sale''', 22, 1, '[
      { name: "floorLevel", type: "number", label: "Floor Level" },
      { name: "totalFloors", type: "number", label: "Total Floors" },
      { name: "hasLift", type: "boolean", label: "Has Elevator/Lift" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('townhouses', 'Townhouses', 'townhouses', 'Townhouses for sale', '🏘️', '''property-sale''', 23, 1, '[
      { name: "totalUnits", type: "number", label: "Total Units in Complex" },
      { name: "communityFees", type: "number", label: "Community Fees" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('duplexes', 'Duplexes', 'duplexes', 'Duplexes for sale', '🏠', '''property-sale''', 24, 1, '[
      { name: "separateEntrances", type: "number", label: "Number of Separate Entrances" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-property', 'Other Property', 'other-property', 'Other types of property for sale', '🏗️', '''property-sale''', 28, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('home-garden', 'Home & Garden', 'home-garden', 'Home and garden items', '🪴', '''for-sale''', 33, 1, '[
      { name: "furnitureType", type: "select", label: "Furniture Type", options: ["Sofa", "Bed", "Table", "Chair", "Cabinet", "Desk", "Storage", "Outdoor", "Other"] },
      { name: "roomType", type: "select", label: "Room Type", options: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Outdoor", "Other"] },
      { name: "style", type: "select", label: "Style", options: ["Modern", "Traditional", "Vintage", "Minimalist", "Industrial", "Bohemian", "Scandinavian", "Other"] },
      { name: "material", type: "text", label: "Material" },
      { name: "dimensions", type: "text", label: "Dimensions (L x W x H cm)" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('sports-outdoors', 'Sports & Outdoors', 'sports-outdoors', 'Sports gear and outdoor equipment', '⚽', '''for-sale''', 34, 1, '[
      { name: "sportType", type: "select", label: "Sport/Activity", options: ["Football", "Basketball", "Tennis", "Swimming", "Cycling", "Gym/Fitness", "Hiking", "Camping", "Water Sports", "Winter Sports", "Martial Arts", "Other"] },
      { name: "usedFor", type: "select", label: "Used For", options: ["Indoor", "Outdoor", "Both"] },
      { name: "skillLevel", type: "select", label: "Skill Level", options: ["Beginner", "Intermediate", "Advanced", "Professional"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('baby-kids', 'Baby & Kids', 'baby-kids', 'Baby and kids items', '👶', '''for-sale''', 35, 1, '[
      { name: "ageRange", type: "select", label: "Age Range", options: ["0-6 months", "6-12 months", "1-2 years", "2-4 years", "4-6 years", "6-8 years", "8-12 years", "12+ years"] },
      { name: "gender", type: "select", label: "Gender", options: ["Boys", "Girls", "Unisex"] },
      { name: "safetyCertified", type: "boolean", label: "Safety Certified" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('books-education', 'Books & Education', 'books-education', 'Books, textbooks, and educational materials', '📚', '''for-sale''', 36, 1, '[
      { name: "bookFormat", type: "select", label: "Format", options: ["Hardcover", "Paperback", "E-Book", "Audiobook"] },
      { name: "genre", type: "text", label: "Genre/Subject" },
      { name: "author", type: "text", label: "Author" },
      { name: "isbn", type: "text", label: "ISBN" },
      { name: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Poor"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('health-beauty', 'Health & Beauty', 'health-beauty', 'Health and beauty products', '💄', '''for-sale''', 37, 1, '[
      { name: "skinType", type: "select", label: "Skin Type", options: ["Normal", "Dry", "Oily", "Combination", "Sensitive", "All Skin Types"] },
      { name: "brand", type: "text", label: "Brand" },
      { name: "expiryDate", type: "date", label: "Expiry Date" },
      { name: "organic", type: "boolean", label: "Organic/Natural" },
      { name: "sealed", type: "boolean", label: "Sealed/Unopened" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('office-business', 'Office & Business', 'office-business', 'Office equipment and business supplies', '💼', '''for-sale''', 38, 1, '[
      { name: "businessType", type: "select", label: "Business Type", options: ["Office Furniture", "Office Equipment", "Point of Sale", "Restaurant Equipment", "Medical Equipment", "Industrial Equipment", "Other"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('industrial-equipment', 'Industrial Equipment', 'industrial-equipment', 'Industrial and commercial equipment', '🏗️', '''for-sale''', 39, 1, '[
      { name: "operatingCondition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Needs Repair", "For Parts"] },
      { name: "voltage", type: "text", label: "Voltage/Power" },
      { name: "powerRating", type: "text", label: "Power Rating" },
      { name: "certification", type: "text", label: "Certification/Standard" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('art-antiques', 'Art & Antiques', 'art-antiques', 'Art, antiques, and collectibles', '🎨', '''for-sale''', 41, 1, '[
      { name: "artType", type: "select", label: "Art Type", options: ["Painting", "Sculpture", "Photography", "Print", "Drawing", "Digital Art", "Antique", "Collectible", "Handcraft", "Jewelry", "Other"] },
      { name: "period", type: "text", label: "Period/Era" },
      { name: "artist", type: "text", label: "Artist/Creator" },
      { name: "dimensions", type: "text", label: "Dimensions" },
      { name: "authenticity", type: "select", label: "Authenticity", options: ["Original", "Limited Edition", "Print/Reproduction", "Vintage Copy", "Unknown"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-items', 'Other Items', 'other-items', 'Other items for sale', '📦', '''for-sale''', 42, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('full-time', 'Full-time', 'full-time', 'Full-time employment', '💼', '''jobs''', 51, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('part-time', 'Part-time', 'part-time', 'Part-time employment', '⏰', '''jobs''', 52, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('contract', 'Contract', 'contract', 'Contract employment', '📝', '''jobs''', 53, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('internship', 'Internship', 'internship', 'Internship positions', '🎓', '''jobs''', 54, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('freelance', 'Freelance', 'freelance', 'Freelance opportunities', '💻', '''jobs''', 55, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('remote', 'Remote / Work from Home', 'remote', 'Remote and work-from-home jobs', '🏠', '''jobs''', 56, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('seasonal', 'Seasonal / Temporary', 'seasonal', 'Seasonal and temporary positions', '❄️', '''jobs''', 57, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('beauty-wellness', 'Beauty & Wellness', 'beauty-wellness', 'Hair, makeup, spa, massage', '💆', '''services''', 63, 1, '[
      { name: "licensed", type: "boolean", label: "Licensed/Certified" },
      { name: "yearsExperience", type: "number", label: "Years of Experience" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('education-training', 'Education & Training', 'education-training', 'Tutoring, lessons, training', '📚', '''services''', 64, 1, '[
      { name: "teachingMode", type: "select", label: "Teaching Mode", options: ["In Person", "Online", "Both"] },
      { name: "hourlyRate", type: "number", label: "Hourly Rate" },
      { name: "qualifications", type: "text", label: "Qualifications" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('events-entertainment', 'Events & Entertainment', 'events-entertainment', 'Photography, DJ, event planning', '🎤', '''services''', 65, 1, '[
      { name: "eventType", type: "multi-select", label: "Event Types", options: ["Wedding", "Birthday", "Corporate", "Concert", "Conference", "Private Party", "Other"] },
      { name: "equipment", type: "text", label: "Equipment Available" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('transport-logistics', 'Transport & Logistics', 'transport-logistics', 'Moving, delivery, taxi', '🚛', '''services''', 66, 1, '[
      { name: "vehicleTypes", type: "multi-select", label: "Vehicle Types", options: ["Car", "Van", "Truck", "Motorcycle", "Bicycle", "Other"] },
      { name: "serviceArea", type: "text", label: "Service Area" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('pet-services', 'Pet Services', 'pet-services', 'Pet sitting, grooming, vet', '🐕', '''services''', 67, 1, '[
      { name: "petTypes", type: "multi-select", label: "Pet Types", options: ["Dogs", "Cats", "Birds", "Fish", "Reptiles", "Small Pets", "All Pets"] },
      { name: "serviceType", type: "multi-select", label: "Services", options: ["Grooming", "Boarding", "Day Care", "Walking", "Training", "Veterinary", "Other"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-services', 'Other Services', 'other-services', 'Other services', '🛠️', '''services''', 68, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('apartments-flats', 'Apartments & Flats', 'apartments-flats', 'Apartments and flats for rent', '🏢', '''rentals''', 71, 1, '[
      { name: "floorLevel", type: "number", label: "Floor Level" },
      { name: "totalFloors", type: "number", label: "Total Floors in Building" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('houses-villas-rental', 'Houses & Villas', 'houses-villas-rental', 'Houses and villas for rent', '🏡', '''rentals''', 72, 1, '[
      { name: "gardenSize", type: "number", label: "Garden Size (m²)" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('rooms', 'Rooms', 'rooms', 'Rooms for rent', '🛏️', '''rentals''', 73, 1, '[
      { name: "roommateCount", type: "number", label: "Current Roommates" },
      { name: "furnished", type: "select", label: "Furnished", options: ["Unfurnished", "Partially Furnished", "Fully Furnished"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('shops-retail', 'Shops & Retail Space', 'shops-retail', 'Retail space for rent', '🏪', '''rentals''', 75, 1, '[
      { name: "shopFront", type: "text", label: "Shop Front Width (m)" },
      { name: "storageArea", type: "number", label: "Storage Area (m²)" },
      { name: "licenseIncluded", type: "boolean", label: "Business License Included" },
      { name: "peakHours", type: "text", label: "Peak Trading Hours" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('warehouses-storage', 'Warehouses & Storage', 'warehouses-storage', 'Warehouses and storage space', '📦', '''rentals''', 76, 1, '[
      { name: "clearHeight", type: "number", label: "Clear Height (m)" },
      { name: "securitySystem", type: "boolean", label: "Security System" },
      { name: "loadingDock", type: "boolean", label: "Loading Dock" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('land-rental', 'Land', 'land-rental', 'Land for rent', '🏔️', '''rentals''', 78, 1, '[
      { name: "landUseType", type: "select", label: "Land Use", options: ["Agricultural", "Commercial", "Industrial", "Recreational"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-rentals', 'Other Rentals', 'other-rentals', 'Other rentals', '🏠', '''rentals''', 79, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('items-wanted', 'Items Wanted', 'items-wanted', 'Items you are looking for', '🛍️', '''wanted''', 81, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('vehicles-wanted', 'Vehicles Wanted', 'vehicles-wanted', 'Vehicles you are looking for', '🚗', '''wanted''', 82, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('property-wanted', 'Property Wanted', 'property-wanted', 'Property you are looking for', '🏠', '''wanted''', 83, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('services-needed', 'Services Needed', 'services-needed', 'Services you are looking for', '🔧', '''wanted''', 84, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('jobs-wanted', 'Jobs Wanted', 'jobs-wanted', 'Job opportunities you are looking for', '💼', '''wanted''', 85, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('roommate-wanted', 'Roommate Wanted', 'roommate-wanted', 'Looking for a roommate', '👥', '''wanted''', 86, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('space-wanted', 'Space Wanted', 'space-wanted', 'Space you are looking for', '📍', '''wanted''', 87, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('free-items', 'Free Items', 'free-items', 'Items for free', '🎁', '''community''', 93, 1, '[
      { name: "category", type: "select", label: "Category", options: ["Furniture", "Electronics", "Clothing", "Books", "Kitchen", "Garden", "Baby Items", "Sports", "Other"] },
      { name: "condition", type: "select", label: "Condition", options: ["New", "Like New", "Good", "Fair", "Poor"] },
      { name: "pickupOnly", type: "boolean", label: "Pickup Only" },
      { name: "location", type: "text", label: "Location" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('volunteers-charity', 'Volunteers & Charity', 'volunteers-charity', 'Volunteer opportunities and charity', '❤️', '''community''', 94, 1, '[
      { name: "organizationName", type: "text", label: "Organization Name" },
      { name: "volunteerType", type: "multi-select", label: "Volunteer Type", options: ["On-site", "Remote", "Both"] },
      { name: "timeCommitment", type: "text", label: "Time Commitment" },
      { name: "description", type: "textarea", label: "Description" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('announcements', 'Announcements', 'announcements', 'Public announcements', '📢', '''community''', 95, 1, '[
      { name: "announcementType", type: "select", label: "Type", options: ["Public Notice", "Community News", "Government", "Business", "Personal"] },
      { name: "validUntil", type: "date", label: "Valid Until" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('discussion-groups', 'Discussion Groups', 'discussion-groups', 'Discussion groups and forums', '💬', '''community''', 96, 1, '[
      { name: "groupType", type: "select", label: "Group Type", options: ["Buy/Sell Group", "Interest Group", "Neighborhood", "Professional", "Support Group", "Other"] },
      { name: "meetingFrequency", type: "text", label: "Meeting Frequency" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-community', 'Other Community', 'other-community', 'Other community posts', '🌐', '''community''', 97, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('concerts-shows', 'Concerts & Shows', 'concerts-shows', 'Concerts and live shows', '🎵', '''events-activities''', 911, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('workshops-classes', 'Workshops & Classes', 'workshops-classes', 'Educational workshops and classes', '🎓', '''events-activities''', 912, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('sports-events', 'Sports Events', 'sports-events', 'Sports tournaments and events', '🏆', '''events-activities''', 913, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('festivals-fairs', 'Festivals & Fairs', 'festivals-fairs', 'Festivals and fair events', '🎪', '''events-activities''', 914, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('community-meetups', 'Community Meetups', 'community-meetups', 'Community gathering meetups', '👋', '''events-activities''', 915, 1, '[]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('dogs', 'Dogs', 'dogs', 'Dogs for sale or adoption', '🐕', '''pets-animals''', 101, 1, '[
      { name: "breed", type: "text", label: "Breed" },
      { name: "registrationPapers", type: "boolean", label: "Registration Papers" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('cats', 'Cats', 'cats', 'Cats for sale or adoption', '🐈', '''pets-animals''', 102, 1, '[
      { name: "breed", type: "text", label: "Breed" },
      { name: "indoorOutdoor", type: "select", label: "Indoor/Outdoor", options: ["Indoor", "Outdoor", "Both"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('birds', 'Birds', 'birds', 'Birds for sale or adoption', '🦜', '''pets-animals''', 103, 1, '[
      { name: "species", type: "text", label: "Species" },
      { name: "talkingAbility", type: "boolean", label: "Can Talk" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('fish-aquariums', 'Fish & Aquariums', 'fish-aquariums', 'Fish and aquarium equipment', '🐠', '''pets-animals''', 104, 1, '[
      { name: "tankSize", type: "text", label: "Tank Size (gallons)" },
      { name: "fishSpecies", type: "text", label: "Fish Species" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('reptiles', 'Reptiles & Amphibians', 'reptiles', 'Reptiles and amphibians', '🦎', '''pets-animals''', 105, 1, '[
      { name: "species", type: "text", label: "Species" },
      { name: "habitatType", type: "text", label: "Habitat Type" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('small-pets', 'Small Pets', 'small-pets', 'Rabbits, hamsters, guinea pigs', '🐹', '''pets-animals''', 106, 1, '[
      { name: "species", type: "text", label: "Species" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('horses-ponies', 'Horses & Ponies', 'horses-ponies', 'Horses and ponies', '🐴', '''pets-animals''', 107, 1, '[
      { name: "registered", type: "boolean", label: "Registered" },
      { name: "trainingLevel", type: "select", label: "Training Level", options: ["Unbroken", "Green", "Intermediate", "Advanced", "School Master"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('farm-animals', 'Farm Animals', 'farm-animals', 'Cattle, sheep, goats, etc.', '🐄', '''pets-animals''', 108, 1, '[
      { name: "purpose", type: "select", label: "Purpose", options: ["Meat", "Dairy", "Breeding", "Wool", "Guard", "Pet"] },
      { name: "registrationPapers", type: "boolean", label: "Registration Papers" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('pet-supplies', 'Pet Supplies & Accessories', 'pet-supplies', 'Pet food, toys, accessories', '🦴', '''pets-animals''', 109, 1, '[
      { name: "petType", type: "select", label: "For Pet Type", options: ["Dog", "Cat", "Bird", "Fish", "Reptile", "Small Pet", "All Pets"] },
      { name: "productType", type: "select", label: "Product Type", options: ["Food", "Toys", "Bedding", "Grooming", "Health", "Accessories", "Equipment"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('pet-services', 'Pet Services', 'pet-services', 'Grooming, boarding, training', '✂️', '''pets-animals''', 110, 1, '[
      { name: "serviceType", type: "multi-select", label: "Services Offered", options: ["Grooming", "Boarding", "Day Care", "Walking", "Training", "Veterinary", "Pet Sitting", "Other"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('livestock-poultry', 'Livestock & Poultry', 'livestock-poultry', 'Livestock and poultry', '🐔', '''agriculture''', 112, 1, '[
      { name: "animalType", type: "text", label: "Animal Type" },
      { name: "breed", type: "text", label: "Breed" },
      { name: "gender", type: "select", label: "Gender", options: ["Male", "Female", "Mixed"] },
      { name: "age", type: "text", label: "Age" },
      { name: "weight", type: "number", label: "Weight (kg)" },
      { name: "vaccinated", type: "boolean", label: "Vaccinated" },
      { name: "healthCertificate", type: "boolean", label: "Health Certificate" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('seeds-plants', 'Seeds & Plants', 'seeds-plants', 'Seeds, seedlings, and plants', '🌱', '''agriculture''', 114, 1, '[
      { name: "seedType", type: "text", label: "Seed/Plant Type" },
      { name: "germinationRate", type: "number", label: "Germination Rate (%)" },
      { name: "purity", type: "number", label: "Purity (%)" },
      { name: "origin", type: "text", label: "Origin/Country" },
      { name: "organic", type: "boolean", label: "Organic" },
      { name: "packaging", type: "text", label: "Packaging Size (kg)" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('fertilizers-chemicals', 'Fertilizers & Chemicals', 'fertilizers-chemicals', 'Fertilizers and agricultural chemicals', '🧪', '''agriculture''', 115, 1, '[
      { name: "productType", type: "select", label: "Product Type", options: ["Fertilizer", "Pesticide", "Herbicide", "Fungicide", "Soil Amendment", "Other"] },
      { name: "organic", type: "boolean", label: "Organic" },
      { name: "applicationMethod", type: "text", label: "Application Method" },
      { name: "coverageArea", type: "text", label: "Coverage Area" }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('fish-aquaculture', 'Fish & Aquaculture', 'fish-aquaculture', 'Fish and aquaculture products', '🐟', '''agriculture''', 116, 1, '[
      { name: "fishSpecies", type: "text", label: "Fish Species" },
      { name: "weight", type: "number", label: "Average Weight (kg)" },
      { name: "age", type: "text", label: "Age/Maturity" },
      { name: "waterType", type: "select", label: "Water Type", options: ["Freshwater", "Saltwater", "Brackish"] }
    ]');
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields) VALUES ('other-agricultural', 'Other Agricultural', 'other-agricultural', 'Other agricultural products', '🌾', '''agriculture''', 117, 1, '[]');
COMMIT;