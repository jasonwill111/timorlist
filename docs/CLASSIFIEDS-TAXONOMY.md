<!-- specweave:living-doc {"name": "CLASSIFIEDS-TAXONOMY.md", "version": "1.0.2", "updated": "2026-06-02", "type": "taxonomy", "domain": "classified-ads", "maintainedBy": "team", "lastChange": "increment-0101-security-audit-fixes"} -->

# Classified Ads Taxonomy (方案 A: 10个一级分类)

> 创建时间: 2026-06-01  
> 最后更新: 2026-06-01  
> 维护者: Team

---

## 一级分类概览

| # | 分类 | Slug | 二级分类数 | 说明 |
|---|------|------|-----------|------|
| 1 | Vehicles | vehicles | 9 | 车辆及配件 |
| 2 | Property Sale | property-sale | 8 | 房产出售 |
| 3 | For Sale | for-sale | 12 | 商品出售 |
| 4 | Jobs | jobs | 7 | 招聘信息 |
| 5 | Services | services | 8 | 服务 |
| 6 | Rentals | rentals | 9 | 租赁 |
| 7 | Wanted | wanted | 7 | 求购/求助 |
| 8 | Community | community | 7 | 社区 |
| 9 | Pets & Animals | pets-animals | 10 | 宠物动物 |
| 10 | Agriculture | agriculture | 15+ | 农业 |

---

## 字段继承机制

所有二级分类继承父级通用字段，可通过 `formFields` 的 `override` 机制覆盖特定字段。

### 继承规则
```
Parent formFields → Child formFields (override)
```

### 字段类型定义
```typescript
type FieldType = 
  | 'text'           // 文本输入
  | 'number'         // 数字输入
  | 'select'         // 下拉选择
  | 'multi-select'  // 多选
  | 'boolean'       // 开关
  | 'date'          // 日期
  | 'email'         // 邮箱
  | 'url'           // 网址
  | 'images'        // 图片上传
  | 'image'         // 单张图片
  | 'textarea'      // 多行文本
  | 'category'      // 分类选择
```

### 字段属性
```typescript
interface FieldDefinition {
  name: string;           // 字段名
  type: FieldType;        // 类型
  label: string;          // 显示标签
  required?: boolean;     // 必填
  defaultValue?: any;     // 默认值
  // 验证
  min?: number;           // 最小值
  max?: number;           // 最大值
  minLength?: number;     // 最小长度
  maxLength?: number;     // 最大长度
  pattern?: string;       // 正则
  // UI
  placeholder?: string;   // 占位符
  hint?: string;          // 提示
  disabled?: boolean;     // 禁用
  // Options (for select/multi-select)
  options?: string[] | { value: string; label: string }[];
}
```

---

## 1. Vehicles (车辆)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| v1 | Cars & SUVs | cars-suvs | vehicles | bodyType, engineSize, drivetrain |
| v2 | Motorcycles & Scooters | motorcycles | vehicles | engineSize_cc, helmetIncluded |
| v3 | Bicycles | bicycles | vehicles | bicycleType, frameSize, suspension |
| v4 | Vans & Trucks | vans-trucks | vehicles | loadCapacity, cabType, bedLength |
| v5 | Boats & Marine | boats-marine | vehicles | length, boatType, hullMaterial |
| v6 | RVs & Campers | rvs-campers | vehicles | sleepingCapacity, bathrooms, hasKitchen |
| v7 | Parts & Accessories | vehicle-parts | vehicles | partType, compatibleMake, compatibleModel |
| v8 | Agricultural Vehicles | agri-vehicles | vehicles | horsepower, hoursUsed, implementsIncluded |
| v9 | Other Vehicles | other-vehicles | vehicles | - |

### 通用字段 (17个)
```json
[
  { "name": "make", "type": "text", "label": "Make/Brand", "required": true },
  { "name": "model", "type": "text", "label": "Model", "required": true },
  { "name": "year", "type": "number", "label": "Year", "required": true, "min": 1900, "max": 2030 },
  { "name": "condition", "type": "select", "label": "Condition", "required": true,
    "options": ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"] },
  { "name": "price", "type": "number", "label": "Price", "required": true, "min": 0 },
  { "name": "negotiable", "type": "boolean", "label": "Price Negotiable" },
  { "name": "mileage", "type": "number", "label": "Mileage (km)", "min": 0 },
  { "name": "fuelType", "type": "select", "label": "Fuel Type",
    "options": ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG", "Other"] },
  { "name": "transmission", "type": "select", "label": "Transmission",
    "options": ["Manual", "Automatic", "Semi-Auto", "CVT"] },
  { "name": "color", "type": "text", "label": "Color" },
  { "name": "description", "type": "textarea", "label": "Description" },
  { "name": "features", "type": "multi-select", "label": "Features",
    "options": ["Sunroof", "Leather Seats", "GPS Navigation", "Bluetooth", "Backup Camera",
               "Heated Seats", "Cruise Control", "4WD/AWD", "ABS", "Airbags", "Parking Sensors",
               "Apple CarPlay", "Android Auto", "Adaptive Cruise", "Lane Keep Assist"] },
  { "name": "images", "type": "images", "label": "Photos", "max": 16 },
  { "name": "registered", "type": "boolean", "label": "Vehicle Registered" },
  { "name": "registeredUntil", "type": "date", "label": "Registration Valid Until" },
  { "name": "warranty", "type": "boolean", "label": "Warranty Available" },
  { "name": "deliveryAvailable", "type": "boolean", "label": "Delivery Available" },
  { "name": "exchangeAccepted", "type": "boolean", "label": "Exchange/Trade Accepted" }
]
```

### 子类特有字段

#### Cars & SUVs (v1)
```json
[
  { "name": "bodyType", "type": "select", "label": "Body Type",
    "options": ["Sedan", "SUV", "Hatchback", "Coupe", "Wagon", "Convertible", "Van", "Truck", "Pickup", "Minivan"] },
  { "name": "engineSize", "type": "text", "label": "Engine Size (L)" },
  { "name": "drivetrain", "type": "select", "label": "Drivetrain", "options": ["FWD", "RWD", "4WD", "AWD"] },
  { "name": "seatingCapacity", "type": "number", "label": "Seating Capacity", "min": 1, "max": 15 },
  { "name": "fuelEfficiency", "type": "text", "label": "Fuel Efficiency (L/100km)" }
]
```

#### Motorcycles & Scooters (v2)
```json
[
  { "name": "engineSize_cc", "type": "number", "label": "Engine Size (cc)", "min": 50 },
  { "name": "helmetIncluded", "type": "boolean", "label": "Helmet Included" },
  { "name": "helmetCount", "type": "number", "label": "Number of Helmets", "min": 0 },
  { "name": "licensePlate", "type": "text", "label": "License Plate" },
  { "name": "motorcycleType", "type": "select", "label": "Type",
    "options": ["Sport", "Cruiser", "Touring", "Adventure", "Naked", "Scooter", "Moped", "Dirt Bike", "Cafe Racer"] }
]
```

#### Bicycles (v3)
```json
[
  { "name": "bicycleType", "type": "select", "label": "Bicycle Type",
    "options": ["Mountain", "Road", "Hybrid", "BMX", "Kids", "Electric", "Folding", "Cargo"] },
  { "name": "frameSize", "type": "text", "label": "Frame Size" },
  { "name": "suspension", "type": "select", "label": "Suspension", "options": ["None", "Front", "Full"] },
  { "name": "brakes", "type": "select", "label": "Brakes", "options": ["Disc", "V-Brake", "Coaster", "Hydraulic"] },
  { "name": "gearCount", "type": "number", "label": "Number of Gears" }
]
```

#### Vans & Trucks (v4)
```json
[
  { "name": "loadCapacity", "type": "number", "label": "Load Capacity (kg)" },
  { "name": "cabType", "type": "select", "label": "Cab Type", "options": ["Regular", "Extended", "Crew"] },
  { "name": "numberOfSeats", "type": "number", "label": "Number of Seats", "min": 1, "max": 15 },
  { "name": "bedLength", "type": "text", "label": "Bed/Load Area Length (m)" },
  { "name": "boxType", "type": "select", "label": "Box Type", "options": ["Open", "Closed", "Refrigerated", "Flatbed"] }
]
```

#### Boats & Marine (v5)
```json
[
  { "name": "length", "type": "number", "label": "Length (m)" },
  { "name": "boatType", "type": "select", "label": "Boat Type",
    "options": ["Sailboat", "Motorboat", "Yacht", "Jet Ski", "Fishing Boat", "Pontoon", "Kayak/Canoe", "Inflatable"] },
  { "name": "hullMaterial", "type": "select", "label": "Hull Material",
    "options": ["Fiberglass", "Aluminum", "Wood", "Steel", "Inflatable"] },
  { "name": "engineType", "type": "select", "label": "Engine Type", "options": ["Outboard", "Inboard", "None"] },
  { "name": "enginePower", "type": "text", "label": "Engine Power (HP)" },
  { "name": "capacity", "type": "number", "label": "Max Capacity (persons)" }
]
```

#### RVs & Campers (v6)
```json
[
  { "name": "sleepingCapacity", "type": "number", "label": "Sleeping Capacity", "min": 1 },
  { "name": "bathrooms", "type": "number", "label": "Number of Bathrooms", "min": 0 },
  { "name": "hasKitchen", "type": "boolean", "label": "Kitchen Available" },
  { "name": "yearBuilt", "type": "number", "label": "Year Built", "min": 1970, "max": 2030 },
  { "name": "slideouts", "type": "number", "label": "Number of Slideouts", "min": 0 },
  { "name": "rvType", "type": "select", "label": "RV Type",
    "options": ["Class A", "Class B", "Class C", "Travel Trailer", "Fifth Wheel", "Pop-up Camper", "Truck Camper"] }
]
```

#### Parts & Accessories (v7)
```json
[
  { "name": "partType", "type": "select", "label": "Part Type",
    "options": ["Engine", "Transmission", "Suspension", "Brakes", "Electrical", "Interior", "Exterior", "Wheels/Tires", "Audio/Electronics", "Other"] },
  { "name": "compatibleMake", "type": "text", "label": "Compatible Make(s)" },
  { "name": "compatibleModel", "type": "text", "label": "Compatible Model(s)" },
  { "name": "newUsed", "type": "select", "label": "Condition", "options": ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"] },
  { "name": "warrantyPeriod", "type": "text", "label": "Warranty Period" },
  { "name": "partNumber", "type": "text", "label": "Part Number" }
]
```

#### Agricultural Vehicles (v8)
```json
[
  { "name": "horsepower", "type": "number", "label": "Horsepower (HP)" },
  { "name": "hoursUsed", "type": "number", "label": "Hours Used" },
  { "name": "implementsIncluded", "type": "boolean", "label": "Implements Included" },
  { "name": "drivetrain", "type": "select", "label": "Drivetrain", "options": ["2WD", "4WD"] },
  { "name": "ptoHp", "type": "number", "label": "PTO Horsepower" },
  { "name": "threePointHitch", "type": "boolean", "label": "3-Point Hitch" }
]
```

---

## 2. Property Sale (房产出售)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| ps1 | Houses & Villas | houses-villas | property-sale | gardenArea, pool |
| ps2 | Apartments & Condos | apartments-condos | property-sale | floorLevel, totalFloors, hasLift |
| ps3 | Townhouses | townhouses | property-sale | totalUnits, communityFees |
| ps4 | Duplexes | duplexes | property-sale | separateEntrances |
| ps5 | Land & Plots | land-plots | property-sale | landType, zoning, utilities |
| ps6 | Commercial Buildings | commercial-buildings | property-sale | businessType, floorCount |
| ps7 | Industrial Buildings | industrial-buildings | property-sale | workshopSpace, loadingBay |
| ps8 | Other Property | other-property | property-sale | - |

### 通用字段 (20个)
```json
[
  { "name": "propertyType", "type": "select", "label": "Property Type", "required": true,
    "options": ["House", "Apartment", "Condo", "Townhouse", "Duplex", "Land", "Commercial", "Industrial"] },
  { "name": "price", "type": "number", "label": "Price (USD)", "required": true, "min": 0 },
  { "name": "negotiable", "type": "boolean", "label": "Price Negotiable" },
  { "name": "condition", "type": "select", "label": "Condition",
    "options": ["New", "Excellent", "Good", "Needs Renovation", "Under Construction"] },
  { "name": "landSize", "type": "number", "label": "Land Size (m²)", "min": 0 },
  { "name": "buildingSize", "type": "number", "label": "Building Size (m²)", "min": 0 },
  { "name": "bedrooms", "type": "number", "label": "Bedrooms", "min": 0 },
  { "name": "bathrooms", "type": "number", "label": "Bathrooms", "min": 0, "max": 20 },
  { "name": "floors", "type": "number", "label": "Number of Floors", "min": 1 },
  { "name": "parkingSpaces", "type": "number", "label": "Parking Spaces", "min": 0 },
  { "name": "location", "type": "text", "label": "Address", "required": true },
  { "name": "city", "type": "text", "label": "City/Town" },
  { "name": "district", "type": "text", "label": "District/Area" },
  { "name": "features", "type": "multi-select", "label": "Features & Amenities",
    "options": ["Garden", "Swimming Pool", "Garage", "Balcony", "Security System", "Elevator/Lift",
               "Furnished", "Air Conditioning", "Central Heating", "Water Supply 24/7",
               "Electricity 24/7", "Internet/WiFi", "Cable TV", "Fire Alarm", "Wheelchair Accessible"] },
  { "name": "viewType", "type": "multi-select", "label": "View Type",
    "options": ["City View", "Sea View", "Mountain View", "Garden View", "Pool View", "River View", "No Specific View"] },
  { "name": "ownershipType", "type": "select", "label": "Ownership Type",
    "options": ["Freehold", "Leasehold", "Strata/Condo", "Cooperative", "Government Lease"] },
  { "name": "titleDeedAvailable", "type": "boolean", "label": "Title Deed Available" },
  { "name": "yearBuilt", "type": "number", "label": "Year Built" },
  { "name": "description", "type": "textarea", "label": "Description" },
  { "name": "images", "type": "images", "label": "Photos", "max": 20 },
  { "name": "videoTour", "type": "url", "label": "Video Tour URL" }
]
```

### 子类特有字段

#### Land & Plots (ps5)
```json
[
  { "name": "landType", "type": "select", "label": "Land Type",
    "options": ["Residential", "Commercial", "Agricultural", "Industrial", "Mixed Use"] },
  { "name": "zoning", "type": "text", "label": "Zoning Classification" },
  { "name": "roadAccess", "type": "select", "label": "Road Access",
    "options": ["Paved Road", "Dirt Road", "No Direct Access", "Shared Access"] },
  { "name": "waterAccess", "type": "boolean", "label": "Water Access" },
  { "name": "electricityAccess", "type": "boolean", "label": "Electricity Access" },
  { "name": "floodRisk", "type": "select", "label": "Flood Risk",
    "options": ["None", "Low", "Medium", "High", "Unknown"] }
]
```

#### Commercial Buildings (ps6)
```json
[
  { "name": "businessType", "type": "select", "label": "Suitable For",
    "options": ["Retail", "Office", "Restaurant", "Hotel", "Warehouse", "Medical", "Educational", "Entertainment"] },
  { "name": "floorCount", "type": "number", "label": "Number of Floors" },
  { "name": "elevatorAvailable", "type": "boolean", "label": "Elevator Available" },
  { "name": "parkingSpaces", "type": "number", "label": "Parking Spaces" },
  { "name": "operatingBusiness", "type": "boolean", "label": "Currently Operating Business" }
]
```

#### Industrial Buildings (ps7)
```json
[
  { "name": "workshopSpace", "type": "number", "label": "Workshop Space (m²)" },
  { "name": "officeSpace", "type": "number", "label": "Office Space (m²)" },
  { "name": "loadingBay", "type": "boolean", "label": "Loading Bay Available" },
  { "name": "craneCapacity", "type": "text", "label": "Crane Capacity (tons)" },
  { "name": "clearHeight", "type": "number", "label": "Clear Height (m)" },
  { "name": "floorLoading", "type": "text", "label": "Floor Loading Capacity" }
]
```

---

## 3. For Sale (商品出售)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| fs1 | Electronics & Gadgets | electronics | for-sale | storage, screenSize |
| fs2 | Fashion & Accessories | fashion | for-sale | gender, size |
| fs3 | Home & Garden | home-garden | for-sale | furnitureType |
| fs4 | Sports & Outdoors | sports-outdoors | for-sale | sportType |
| fs5 | Baby & Kids | baby-kids | for-sale | ageRange |
| fs6 | Books & Education | books-education | for-sale | bookFormat |
| fs7 | Health & Beauty | health-beauty | for-sale | skinType |
| fs8 | Office & Business | office-business | for-sale | businessType |
| fs9 | Industrial Equipment | industrial-equipment | for-sale | operatingCondition |
| fs10 | Musical Instruments | musical-instruments | for-sale | instrumentType, isElectric |
| fs11 | Art & Antiques | art-antiques | for-sale | artType, period |
| fs12 | Other Items | other-items | for-sale | - |

### 通用字段 (22个)
```json
[
  { "name": "title", "type": "text", "label": "Title", "required": true, "maxLength": 100 },
  { "name": "category", "type": "category", "label": "Category", "required": true },
  { "name": "condition", "type": "select", "label": "Condition", "required": true,
    "options": ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"] },
  { "name": "price", "type": "number", "label": "Price", "required": true, "min": 0 },
  { "name": "negotiable", "type": "boolean", "label": "Price Negotiable" },
  { "name": "quantity", "type": "number", "label": "Quantity Available", "min": 1, "defaultValue": 1 },
  { "name": "brand", "type": "text", "label": "Brand" },
  { "name": "model", "type": "text", "label": "Model/Serial Number" },
  { "name": "color", "type": "text", "label": "Color" },
  { "name": "size", "type": "text", "label": "Size" },
  { "name": "material", "type": "text", "label": "Material" },
  { "name": "dimensions", "type": "text", "label": "Dimensions (L x W x H)" },
  { "name": "weight", "type": "number", "label": "Weight (kg)", "min": 0 },
  { "name": "warranty", "type": "boolean", "label": "Warranty Available" },
  { "name": "warrantyExpiry", "type": "date", "label": "Warranty Expires" },
  { "name": "originalPackaging", "type": "boolean", "label": "Original Packaging" },
  { "name": "receiptAvailable", "type": "boolean", "label": "Receipt Available" },
  { "name": "location", "type": "text", "label": "Location" },
  { "name": "deliveryAvailable", "type": "boolean", "label": "Delivery Available" },
  { "name": "deliveryFee", "type": "number", "label": "Delivery Fee" },
  { "name": "meetupPreferred", "type": "boolean", "label": "Meetup Preferred" },
  { "name": "description", "type": "textarea", "label": "Description" },
  { "name": "defects", "type": "textarea", "label": "Known Defects/Issues" },
  { "name": "images", "type": "images", "label": "Photos", "max": 12 }
]
```

### 子类特有字段

#### Electronics & Gadgets (fs1)
```json
[
  { "name": "storage", "type": "text", "label": "Storage Capacity (GB/TB)" },
  { "name": "ram", "type": "text", "label": "RAM (GB)" },
  { "name": "screenSize", "type": "text", "label": "Screen Size" },
  { "name": "networkType", "type": "select", "label": "Network",
    "options": ["WiFi Only", "WiFi + Cellular", "4G", "5G"] },
  { "name": "batteryHealth", "type": "number", "label": "Battery Health (%)", "min": 0, "max": 100 },
  { "name": "operatingSystem", "type": "select", "label": "Operating System",
    "options": ["iOS", "Android", "Windows", "macOS", "Linux", "Not Applicable"] },
  { "name": "accessoriesIncluded", "type": "multi-select", "label": "Accessories Included",
    "options": ["Charger", "Cable", "Case", "Earbuds", "Manual", "Original Box"] }
]
```

#### Fashion & Accessories (fs2)
```json
[
  { "name": "gender", "type": "select", "label": "Gender", "options": ["Men", "Women", "Unisex", "Boys", "Girls", "Kids"] },
  { "name": "clothingSize", "type": "text", "label": "Clothing Size" },
  { "name": "shoeSize", "type": "text", "label": "Shoe Size (EU/US/UK)" },
  { "name": "waistSize", "type": "text", "label": "Waist Size" },
  { "name": "chestSize", "type": "text", "label": "Chest Size" },
  { "name": "material", "type": "text", "label": "Material/Fabric" },
  { "name": "designer", "type": "text", "label": "Designer/Brand" },
  { "name": "authentic", "type": "boolean", "label": "Authentic/Original" }
]
```

#### Musical Instruments (fs10)
```json
[
  { "name": "instrumentType", "type": "select", "label": "Instrument Type",
    "options": ["Guitar", "Piano/Keyboard", "Drums", "Violin", "Saxophone", "Trumpet", "Flute", "Other"] },
  { "name": "isElectric", "type": "boolean", "label": "Electric/Acoustic" },
  { "name": "caseIncluded", "type": "boolean", "label": "Case Included" },
  { "name": "ampIncluded", "type": "boolean", "label": "Amplifier Included" },
  { "name": "age", "type": "text", "label": "Age of Instrument" },
  { "name": "modifications", "type": "text", "label": "Modifications/Upgrades" }
]
```

---

## 4. Jobs (招聘)

### 二级分类
| ID | 名称 | Slug | Parent ID |
|----|------|------|-----------|
| j1 | Full-time | full-time | jobs |
| j2 | Part-time | part-time | jobs |
| j3 | Contract | contract | jobs |
| j4 | Internship | internship | jobs |
| j5 | Freelance | freelance | jobs |
| j6 | Remote / Work from Home | remote | jobs |
| j7 | Seasonal / Temporary | seasonal | jobs |

### 通用字段 (25个)
```json
[
  { "name": "jobTitle", "type": "text", "label": "Job Title", "required": true, "maxLength": 100 },
  { "name": "companyName", "type": "text", "label": "Company Name", "required": true },
  { "name": "companyLogo", "type": "image", "label": "Company Logo" },
  { "name": "companySize", "type": "select", "label": "Company Size",
    "options": ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] },
  { "name": "companyIndustry", "type": "text", "label": "Industry" },
  { "name": "employmentType", "type": "select", "label": "Employment Type", "required": true,
    "options": ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote", "Seasonal"] },
  { "name": "salaryMin", "type": "number", "label": "Min Salary" },
  { "name": "salaryMax", "type": "number", "label": "Max Salary" },
  { "name": "salaryCurrency", "type": "select", "label": "Currency",
    "options": ["USD", "IDR", "AUD", "EUR", "GBP", "SGD", "MYR", "PHP", "THB", "VND"] },
  { "name": "salaryPeriod", "type": "select", "label": "Salary Period",
    "options": ["hour", "day", "week", "month", "year"] },
  { "name": "salaryNegotiable", "type": "boolean", "label": "Salary Negotiable" },
  { "name": "experienceLevel", "type": "select", "label": "Experience Level",
    "options": ["Entry Level", "Junior (1-3 years)", "Mid Level (3-5 years)", "Senior (5-10 years)", "Lead/Manager", "Executive"] },
  { "name": "educationLevel", "type": "select", "label": "Education Required",
    "options": ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Any"] },
  { "name": "qualifications", "type": "textarea", "label": "Qualifications Required" },
  { "name": "skills", "type": "multi-select", "label": "Skills Required",
    "options": ["Communication", "Leadership", "Problem Solving", "Teamwork", "Adaptability", "Time Management",
               "Technical Writing", "Project Management", "Data Analysis", "Customer Service"] },
  { "name": "jobDescription", "type": "textarea", "label": "Job Description" },
  { "name": "responsibilities", "type": "textarea", "label": "Key Responsibilities" },
  { "name": "benefits", "type": "textarea", "label": "Benefits & Perks" },
  { "name": "location", "type": "text", "label": "Work Location", "required": true },
  { "name": "city", "type": "text", "label": "City" },
  { "name": "remoteAllowed", "type": "boolean", "label": "Remote/Hybrid Allowed" },
  { "name": "travelRequired", "type": "boolean", "label": "Travel Required" },
  { "name": "applicationDeadline", "type": "date", "label": "Application Deadline" },
  { "name": "startDate", "type": "date", "label": "Start Date" },
  { "name": "contactName", "type": "text", "label": "Contact Person" },
  { "name": "contactEmail", "type": "email", "label": "Contact Email", "required": true },
  { "name": "contactPhone", "type": "text", "label": "Contact Phone" },
  { "name": "applicationUrl", "type": "url", "label": "Apply Online URL" },
  { "name": "images", "type": "images", "label": "Company/Office Photos", "max": 5 }
]
```

---

## 5. Services (服务)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| sv1 | Professional Services | professional-services | services | qualificationCert |
| sv2 | Home Services | home-services | services | serviceRadius |
| sv3 | Beauty & Wellness | beauty-wellness | services | licensed |
| sv4 | Education & Training | education-training | services | teachingMode |
| sv5 | Events & Entertainment | events-entertainment | services | eventType |
| sv6 | Transport & Logistics | transport-logistics | services | vehicleTypes |
| sv7 | Pet Services | pet-services | services | petTypes |
### 通用字段 (23个)
```json
[
  { "name": "serviceName", "type": "text", "label": "Service/Business Name", "required": true },
  { "name": "serviceType", "type": "select", "label": "Service Category", "required": true,
    "options": ["Professional", "Home", "Beauty", "Education", "Events", "Transport", "Pet", "Other"] },
  { "name": "pricingType", "type": "select", "label": "Pricing Type", "required": true,
    "options": ["Fixed Price", "Hourly Rate", "Daily Rate", "Per Project", "Starting From", "Negotiable", "Free"] },
  { "name": "price", "type": "number", "label": "Price", "min": 0 },
  { "name": "priceCurrency", "type": "select", "label": "Currency",
    "options": ["USD", "IDR", "AUD", "EUR", "GBP", "SGD"] },
  { "name": "priceIncludes", "type": "textarea", "label": "Price Includes" },
  { "name": "serviceArea", "type": "text", "label": "Service Area/Coverage" },
  { "name": "remoteAvailable", "type": "boolean", "label": "Remote/Online Available" },
  { "name": "availability", "type": "select", "label": "Availability",
    "options": ["Available Now", "By Appointment", "Weekdays Only", "Weekends Only", "Evenings Only", "Flexible"] },
  { "name": "workingHours", "type": "text", "label": "Working Hours", "placeholder": "e.g., Mon-Fri 9AM-6PM" },
  { "name": "responseTime", "type": "select", "label": "Response Time",
    "options": ["Within 1 hour", "Within 24 hours", "Within 3 days", "Within 1 week"] },
  { "name": "description", "type": "textarea", "label": "Service Description" },
  { "name": "experience", "type": "number", "label": "Years of Experience" },
  { "name": "qualifications", "type": "textarea", "label": "Qualifications/Certifications" },
  { "name": "portfolio", "type": "url", "label": "Portfolio/Website URL" },
  { "name": "insured", "type": "boolean", "label": "Fully Insured" },
  { "name": "bonded", "type": "boolean", "label": "Bonded" },
  { "name": "homeVisit", "type": "boolean", "label": "Home Visit Available" },
  { "name": "emergencyService", "type": "boolean", "label": "Emergency Service" },
  { "name": "rushJobAvailable", "type": "boolean", "label": "Rush Job Available" },
  { "name": "contactName", "type": "text", "label": "Contact Person" },
  { "name": "contactPhone", "type": "text", "label": "Phone" },
  { "name": "contactWhatsApp", "type": "text", "label": "WhatsApp" },
  { "name": "contactEmail", "type": "email", "label": "Email" },
  { "name": "rating", "type": "number", "label": "Average Rating", "min": 0, "max": 5 },
  { "name": "reviewCount", "type": "number", "label": "Number of Reviews" },
  { "name": "images", "type": "images", "label": "Service Photos", "max": 12 }
]
```

### 子类特有字段

#### Professional Services (sv1)
```json
[
  { "name": "qualificationCert", "type": "text", "label": "Professional License/Certification" },
  { "name": "yearsInBusiness", "type": "number", "label": "Years in Business" },
  { "name": "insurance", "type": "boolean", "label": "Professional Liability Insurance" }
]
```

#### Home Services (sv2)
```json
[
  { "name": "serviceRadius", "type": "number", "label": "Service Radius (km)" },
  { "name": "toolsIncluded", "type": "boolean", "label": "Tools & Materials Included" },
  { "name": "cleanupIncluded", "type": "boolean", "label": "Cleanup Included" }
]
```

---

## 6. Rentals (租赁)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| r1 | Apartments & Flats | apartments-flats | rentals | floorLevel, totalFloors |
| r2 | Houses & Villas | houses-villas | rentals | gardenSize |
| r3 | Rooms | rooms | rentals | roommateCount, furnished |
| r4 | Offices | offices | rentals | workspaceArea, meetingRooms |
| r5 | Shops & Retail Space | shops-retail | rentals | shopFront, storageArea |
| r6 | Warehouses & Storage | warehouses-storage | rentals | clearHeight, securitySystem |
| r7 | Vacation Rentals | vacation-rentals | rentals | minStay, maxGuests |
| r8 | Land | land | rentals | landUseType |
| r9 | Other Rentals | other-rentals | rentals | - |

### 通用字段 (23个)
```json
[
  { "name": "rentalType", "type": "select", "label": "Property Type", "required": true,
    "options": ["Apartment", "House", "Room", "Office", "Shop", "Warehouse", "Vacation", "Land", "Other"] },
  { "name": "rentAmount", "type": "number", "label": "Rent Amount", "required": true, "min": 0 },
  { "name": "rentCurrency", "type": "select", "label": "Currency",
    "options": ["USD", "IDR", "AUD", "EUR", "GBP", "SGD"] },
  { "name": "rentPeriod", "type": "select", "label": "Rent Period", "required": true,
    "options": ["day", "week", "month", "year"] },
  { "name": "bondAmount", "type": "number", "label": "Bond/Security Deposit" },
  { "name": "bondMonths", "type": "number", "label": "Bond (months)", "min": 0, "max": 12 },
  { "name": "billsIncluded", "type": "multi-select", "label": "Bills Included",
    "options": ["Electricity", "Water", "Internet", "Gas", "TV/Cable", "Management Fees", "None"] },
  { "name": "minRentalPeriod", "type": "number", "label": "Minimum Rental Period", "min": 1 },
  { "name": "minRentalUnit", "type": "select", "label": "Minimum Period Unit",
    "options": ["days", "weeks", "months", "years"] },
  { "name": "availableFrom", "type": "date", "label": "Available From", "required": true },
  { "name": "availableTo", "type": "date", "label": "Available To" },
  { "name": "bedrooms", "type": "number", "label": "Bedrooms", "min": 0 },
  { "name": "bathrooms", "type": "number", "label": "Bathrooms", "min": 0, "max": 10 },
  { "name": "parkingSpaces", "type": "number", "label": "Parking Spaces", "min": 0 },
  { "name": "furnished", "type": "select", "label": "Furnished",
    "options": ["Unfurnished", "Partially Furnished", "Fully Furnished"] },
  { "name": "petFriendly", "type": "boolean", "label": "Pet Friendly" },
  { "name": "smokingAllowed", "type": "boolean", "label": "Smoking Allowed" },
  { "name": "amenities", "type": "multi-select", "label": "Amenities",
    "options": ["WiFi", "Air Conditioning", "Heating", "Hot Water", "Washing Machine", "Refrigerator",
               "TV", "Gym", "Pool", "Security", "Elevator/Lift", "Garden", "Balcony", "Wheelchair Access"] },
  { "name": "location", "type": "text", "label": "Location/Address", "required": true },
  { "name": "city", "type": "text", "label": "City" },
  { "name": "proximityTo", "type": "text", "label": "Near (schools, hospitals, etc.)" },
  { "name": "houseRules", "type": "textarea", "label": "House Rules" },
  { "name": "maxOccupants", "type": "number", "label": "Maximum Occupants", "min": 1 },
  { "name": "images", "type": "images", "label": "Photos", "max": 16 }
]
```

### 子类特有字段

#### Offices (r4)
```json
[
  { "name": "floorLevel", "type": "number", "label": "Floor Level" },
  { "name": "totalFloors", "type": "number", "label": "Total Floors in Building" },
  { "name": "workspaceArea", "type": "number", "label": "Workspace Area (m²)" },
  { "name": "meetingRooms", "type": "number", "label": "Meeting Rooms" },
  { "name": "receptionist", "type": "boolean", "label": "Receptionist Service" },
  { "name": "internetIncluded", "type": "boolean", "label": "Internet Included" },
  { "name": "phoneSystem", "type": "boolean", "label": "Phone System Available" }
]
```

#### Vacation Rentals (r7)
```json
[
  { "name": "minStay", "type": "number", "label": "Minimum Stay (nights)", "min": 1 },
  { "name": "maxGuests", "type": "number", "label": "Maximum Guests", "min": 1 },
  { "name": "checkInTime", "type": "text", "label": "Check-in Time" },
  { "name": "checkOutTime", "type": "text", "label": "Check-out Time" },
  { "name": "poolAccess", "type": "boolean", "label": "Pool Access" },
  { "name": "beachAccess", "type": "boolean", "label": "Beach Access" },
  { "name": "cleaningFee", "type": "number", "label": "Cleaning Fee" },
  { "name": "cancellationPolicy", "type": "select", "label": "Cancellation Policy",
    "options": ["Flexible", "Moderate", "Strict", "Non-refundable"] }
]
```

---

## 7. Wanted (求购/求助)

### 二级分类
| ID | 名称 | Slug | Parent ID |
|----|------|------|-----------|
| w1 | Items Wanted | items-wanted | wanted |
| w2 | Vehicles Wanted | vehicles-wanted | wanted |
| w3 | Property Wanted | property-wanted | wanted |
| w4 | Services Needed | services-needed | wanted |
| w5 | Jobs Wanted | jobs-wanted | wanted |
| w6 | Roommate Wanted | roommate-wanted | wanted |
| w7 | Space Wanted | space-wanted | wanted |

### 通用字段 (17个)
```json
[
  { "name": "wantedType", "type": "select", "label": "Looking For", "required": true,
    "options": ["Item", "Vehicle", "Property", "Service", "Job", "Roommate", "Space"] },
  { "name": "title", "type": "text", "label": "What Are You Looking For", "required": true },
  { "name": "budgetMin", "type": "number", "label": "Min Budget", "min": 0 },
  { "name": "budgetMax", "type": "number", "label": "Max Budget", "min": 0 },
  { "name": "budgetCurrency", "type": "select", "label": "Currency",
    "options": ["USD", "IDR", "AUD", "EUR", "GBP", "SGD"] },
  { "name": "negotiable", "type": "boolean", "label": "Budget Flexible" },
  { "name": "condition", "type": "select", "label": "Preferred Condition",
    "options": ["Any", "New", "Like New", "Excellent", "Good", "Fair"] },
  { "name": "brandPreference", "type": "text", "label": "Brand Preference" },
  { "name": "modelPreference", "type": "text", "label": "Model/Type Preference" },
  { "name": "location", "type": "text", "label": "Preferred Location" },
  { "name": "willingToTravel", "type": "boolean", "label": "Willing to Travel" },
  { "name": "travelDistance", "type": "text", "label": "Max Travel Distance" },
  { "name": "urgency", "type": "select", "label": "Urgency",
    "options": ["Flexible", "Within 1 Month", "Soon", "Urgent", "ASAP"] },
  { "name": "neededBy", "type": "date", "label": "Needed By" },
  { "name": "description", "type": "textarea", "label": "Details/Requirements" },
  { "name": "images", "type": "images", "label": "Reference Images", "max": 5 },
  { "name": "contactPreference", "type": "select", "label": "Contact Preference",
    "options": ["Phone", "WhatsApp", "Email", "In Person", "Any"] },
  { "name": "contactPhone", "type": "text", "label": "Phone" },
  { "name": "contactEmail", "type": "email", "label": "Email" },
  { "name": "contactWhatsApp", "type": "text", "label": "WhatsApp" }
]
```

## 8. Community (社区)
### 二级分类
| ID | 名称 | Slug | Parent ID |
|----|------|------|-----------|
| c1 | Events & Activities | events-activities | community |
| c2 | Lost & Found | lost-found | community |
| c3 | Free Items | free-items | community |
| c4 | Volunteers & Charity | volunteers-charity | community |
| c5 | Announcements | announcements | community |
| c6 | Discussion Groups | discussion-groups | community |
| c7 | Other Community | other-community | community |
### Events 子分类 (c1 的子类)
| ID | 名称 | Slug | Parent ID |
|----|------|------|-----------|
| c1-1 | Concerts & Shows | concerts-shows | events-activities |
| c1-2 | Workshops & Classes | workshops-classes | events-activities |
| c1-3 | Sports Events | sports-events | events-activities |
| c1-4 | Festivals & Fairs | festivals-fairs | events-activities |
| c1-5 | Community Meetups | community-meetups | events-activities |
### Events & Activities 字段 (20个)
```json
[
  { "name": "eventName", "type": "text", "label": "Event Name", "required": true },
  { "name": "eventType", "type": "select", "label": "Event Type", "required": true,
    "options": ["Concert/Performance", "Workshop/Class", "Conference/Seminar", "Festival/Fair",
               "Sports Event", "Community Meetup", "Market/Bazaar", "Exhibition", "Other"] },
  { "name": "eventDate", "type": "date", "label": "Event Date", "required": true },
  { "name": "eventTime", "type": "text", "label": "Start Time", "placeholder": "e.g., 7:00 PM" },
  { "name": "eventEndDate", "type": "date", "label": "End Date" },
  { "name": "duration", "type": "text", "label": "Duration", "placeholder": "e.g., 3 hours" },
  { "name": "recurring", "type": "select", "label": "Recurring",
    "options": ["One-time", "Daily", "Weekly", "Bi-weekly", "Monthly"] },
  { "name": "venue", "type": "text", "label": "Venue/Location", "required": true },
  { "name": "city", "type": "text", "label": "City" },
  { "name": "virtualEvent", "type": "boolean", "label": "Virtual/Online Event" },
  { "name": "meetingLink", "type": "url", "label": "Virtual Meeting Link" },
  { "name": "ticketRequired", "type": "boolean", "label": "Ticket Required" },
  { "name": "ticketPrice", "type": "number", "label": "Ticket Price", "min": 0 },
  { "name": "freeEntry", "type": "boolean", "label": "Free Entry" },
  { "name": "ticketsAvailable", "type": "number", "label": "Tickets Available" },
  { "name": "organizerName", "type": "text", "label": "Organizer" },
  { "name": "organizerContact", "type": "text", "label": "Organizer Contact" },
  { "name": "ageRestriction", "type": "text", "label": "Age Restriction", "placeholder": "e.g., 18+, All Ages" },
  { "name": "dressCode", "type": "text", "label": "Dress Code" },
  { "name": "description", "type": "textarea", "label": "Event Description" },
  { "name": "images", "type": "images", "label": "Event Images", "max": 8 }
]
```

### Lost & Found 字段 (14个)
```json
[
  { "name": "itemType", "type": "select", "label": "Type", "required": true,
    "options": ["Lost Item", "Found Item", "Lost Pet"] },
  { "name": "category", "type": "text", "label": "Item Category", "placeholder": "e.g., Phone, Wallet, Keys" },
  { "name": "lostDate", "type": "date", "label": "Lost Date" },
  { "name": "foundDate", "type": "date", "label": "Found Date" },
  { "name": "location", "type": "text", "label": "Location", "required": true },
  { "name": "color", "type": "text", "label": "Color" },
  { "name": "brand", "type": "text", "label": "Brand" },
  { "name": "distinguishingFeatures", "type": "textarea", "label": "Distinguishing Features" },
  { "name": "reward", "type": "boolean", "label": "Reward Offered" },
  { "name": "rewardAmount", "type": "number", "label": "Reward Amount" },
  { "name": "description", "type": "textarea", "label": "Description" },
  { "name": "images", "type": "images", "label": "Photos", "max": 5 },
  { "name": "contactPhone", "type": "text", "label": "Contact Phone" },
  { "name": "contactEmail", "type": "email", "label": "Contact Email" }
]
```

---

## 9. Pets & Animals (宠物动物)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| p1 | Dogs | dogs | pets-animals | breed, registrationPapers |
| p2 | Cats | cats | pets-animals | breed, indoorOutdoor |
| p3 | Birds | birds | pets-animals | species, talkingAbility |
| p4 | Fish & Aquariums | fish-aquariums | pets-animals | tankSize, fishSpecies |
| p5 | Reptiles & Amphibians | reptiles | pets-animals | species, habitatType |
| p6 | Small Pets | small-pets | pets-animals | species |
| p7 | Horses & Ponies | horses-ponies | pets-animals | registered, trainingLevel |
| p8 | Farm Animals | farm-animals | pets-animals | purpose, registrationPapers |
| p9 | Pet Supplies & Accessories | pet-supplies | pets-animals | petType, productType |
| p10 | Pet Services | pet-services | pets-animals | serviceType |

### 通用字段 (25个)
[
  { "name": "petType", "type": "select", "label": "Pet Type", "required": true,
    "options": ["Dog", "Cat", "Bird", "Fish", "Reptile", "Rabbit", "Hamster", "Guinea Pig", "Horse", "Farm Animal", "Other"] },
  { "name": "breed", "type": "text", "label": "Breed" },
  { "name": "mixedBreed", "type": "boolean", "label": "Mixed Breed" },
  { "name": "name", "type": "text", "label": "Name (if named)" },
  { "name": "age", "type": "select", "label": "Age", "required": true,
    "options": ["Baby (0-6 months)", "Young (6-12 months)", "Adult (1-8 years)", "Senior (8+ years)"] },
  { "name": "ageMonths", "type": "number", "label": "Age in Months (if known)", "min": 0 },
  { "name": "gender", "type": "select", "label": "Gender", "required": true,
    "options": ["Male", "Female", "Unknown"] },
  { "name": "size", "type": "select", "label": "Size",
    "options": ["Toy", "Small", "Medium", "Large", "Giant"] },
  { "name": "vaccinated", "type": "boolean", "label": "Vaccinated" },
  { "name": "vaccinationRecords", "type": "boolean", "label": "Vaccination Records Available" },
  { "name": "dewormed", "type": "boolean", "label": "Dewormed" },
  { "name": "spayedNeutered", "type": "boolean", "label": "Spayed/Neutered" },
  { "name": "microchipped", "type": "boolean", "label": "Microchipped" },
  { "name": "microchipNumber", "type": "text", "label": "Microchip Number" },
  { "name": "registrationPapers", "type": "boolean", "label": "Registration Papers Available" },
  { "name": "pedigree", "type": "boolean", "label": "Pedigree/Show Quality" },
  { "name": "healthIssues", "type": "textarea", "label": "Health Issues/Special Needs" },
  { "name": "listingType", "type": "select", "label": "Listing Type", "required": true,
    "options": ["For Sale", "Free to Good Home", "For Adoption", "Stud Service", "Lost", "Found", "For Hire"] },
  { "name": "rehomingFee", "type": "number", "label": "Rehoming Fee" },
  { "name": "reasonForRehoming", "type": "textarea", "label": "Reason for Rehoming" },
  { "name": "temperament", "type": "multi-select", "label": "Temperament",
    "options": ["Friendly", "Shy", "Playful", "Calm", "Energetic", "Good with Kids", "Good with Dogs",
               "Good with Cats", "House Trained", "Crate Trained", "Leash Trained"] },
  { "name": "specialNeeds", "type": "textarea", "label": "Special Needs/Requirements" },
  { "name": "images", "type": "images", "label": "Photos", "max": 12 },
  { "name": "location", "type": "text", "label": "Location", "required": true },
  { "name": "adoptRequirements", "type": "textarea", "label": "Adoption Requirements" }
]
```

---

## 10. Agriculture (农业)

### 二级分类
| ID | 名称 | Slug | Parent ID | 特有字段 |
|----|------|------|-----------|---------|
| a1 | Crops & Produce | crops-produce | agriculture | cropType, harvestDate |
| a2 | Livestock & Poultry | livestock-poultry | agriculture | animalType, breed |
| a3 | Farm Equipment | farm-equipment | agriculture | brand, hoursUsed |
| a4 | Seeds & Plants | seeds-plants | agriculture | seedType, germinationRate |
| a5 | Fertilizers & Chemicals | fertilizers-chemicals | agriculture | productType, organic |
| a6 | Fish & Aquaculture | fish-aquaculture | agriculture | fishSpecies, waterType |
| a7 | Other Agricultural | other-agricultural | agriculture | - |

### 通用字段 (19个)
```json
[
  { "name": "agriType", "type": "select", "label": "Type", "required": true,
    "options": ["Crops", "Livestock", "Equipment", "Seeds", "Fertilizer", "Fish", "Other"] },
  { "name": "title", "type": "text", "label": "Title", "required": true },
  { "name": "price", "type": "number", "label": "Price", "required": true, "min": 0 },
  { "name": "negotiable", "type": "boolean", "label": "Negotiable" },
  { "name": "pricePerUnit", "type": "text", "label": "Price Per Unit", "placeholder": "e.g., per kg, per head" },
  { "name": "quantity", "type": "number", "label": "Total Quantity" },
  { "name": "unit", "type": "text", "label": "Unit", "placeholder": "e.g., kg, head, piece" },
  { "name": "availableQuantity", "type": "number", "label": "Currently Available" },
  { "name": "quality", "type": "select", "label": "Quality",
    "options": ["Premium", "Grade A", "Grade B", "Standard", "For Processing"] },
  { "name": "organic", "type": "boolean", "label": "Organic/Organic Certified" },
  { "name": "certification", "type": "text", "label": "Certifications" },
  { "name": "soilType", "type": "select", "label": "Soil Type",
    "options": ["Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky", "Not Applicable"] },
  { "name": "climateZone", "type": "text", "label": "Climate Zone" },
  { "name": "location", "type": "text", "label": "Farm Location" },
  { "name": "deliveryAvailable", "type": "boolean", "label": "Delivery Available" },
  { "name": "deliveryArea", "type": "text", "label": "Delivery Area" },
  { "name": "description", "type": "textarea", "label": "Description" },
  { "name": "images", "type": "images", "label": "Photos", "max": 12 }
]

### 子类特有字段

#### Crops & Produce (a1)
```json
[
  { "name": "cropType", "type": "text", "label": "Crop Type" },
  { "name": "harvestDate", "type": "date", "label": "Harvest Date" },
  { "name": "plantingDate", "type": "date", "label": "Planting Date" },
  { "name": "expectedYield", "type": "text", "label": "Expected Yield" },
  { "name": "irrigationType", "type": "select", "label": "Irrigation",
    "options": ["Rain-fed", "Drip", "Sprinkler", "Flood", "Manual"] },
  { "name": "pesticideFree", "type": "boolean", "label": "Pesticide Free" },
  { "name": "packaging", "type": "text", "label": "Packaging Type" }
]
```

#### Farm Equipment (a3)
```json
[
  { "name": "brand", "type": "text", "label": "Brand" },
  { "name": "model", "type": "text", "label": "Model" },
  { "name": "year", "type": "number", "label": "Year", "min": 1950 },
  { "name": "hoursUsed", "type": "number", "label": "Hours Used" },
  { "name": "operatingCondition", "type": "select", "label": "Condition",
    "options": ["New", "Like New", "Good", "Fair", "Needs Repair", "For Parts"] },
  { "name": "warranty", "type": "boolean", "label": "Warranty Available" },
  { "name": "sparePartsAvailable", "type": "boolean", "label": "Spare Parts Available" },
## 字段统计
| 一级分类 | 二级分类数 | 通用字段数 | 特有字段总数 |
|---------|-----------|-----------|-------------|
| Vehicles | 9 | 17 | 38 |
| Property Sale | 8 | 21 | 24 |
| For Sale | 12 | 22 | 32 |
| Jobs | 7 | 25 | 0 |
| Services | 8 | 23 | 9 |
| Rentals | 9 | 23 | 16 |
| Wanted | 7 | 17 | 0 |
| Community | 12 | 20 | 0 |
| Pets & Animals | 10 | 25 | 0 |
| Agriculture | 7 | 19 | 17 |
| **总计** | **89** | **212** | **136** |
### 继承后实际字段数
不使用继承: 348 个字段定义
使用继承后: ~212 个字段定义（仅通用字段）
节省: ~39%
- **节省: ~40%**

---

## 分类 Slug 映射

用于 URL 和数据库查询：

| 一级分类 | Slug | 中文 |
|---------|------|------|
| Vehicles | vehicles | 车辆 |
| Property Sale | property-sale | 房产出售 |
| For Sale | for-sale | 商品出售 |
| Jobs | jobs | 招聘 |
| Services | services | 服务 |
| Rentals | rentals | 租赁 |
| Wanted | wanted | 求购 |
| Community | community | 社区 |
| Pets & Animals | pets-animals | 宠物动物 |
| Agriculture | agriculture | 农业 |

---

## 迁移计划

### Phase 1: Schema 更新
- [ ] 移除 `listings.listingType` (从 category.parentId 派生)
- [ ] 重命名 `adBanners.startDate/endDate` → `planExpiresAt`
- [ ] 移除 `businesses.planSlug` (从 orders 查询)

### Phase 2: Category 数据
- [ ] 创建 10 个一级分类
- [ ] 创建 84 个二级分类
- [ ] 配置 formFields JSON

### Phase 3: Frontend
- [ ] 更新表单渲染逻辑 (resolveFormFields)
- [ ] 更新分类选择器
- [ ] 更新 URL 结构

---

*文档版本: 1.0.0 | 最后更新: 2026-06-01*
