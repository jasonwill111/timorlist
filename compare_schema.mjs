// Comprehensive schema comparison: Local (Drizzle) vs Remote (D1)
// Parse the remote schemas we fetched

const remoteRaw = `
businesses:CREATE TABLE businesses (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    banner_image_id TEXT,
    profile_image_id TEXT,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    year_of_establishment INTEGER,
    email TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    opening_hours TEXT,
    about_us TEXT,
    latest_updates TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    rating_average REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    plan_type TEXT,
    publish_date INTEGER,
    expiry_date INTEGER,
    subscription_status TEXT DEFAULT 'none',
    subscription_expires_at INTEGER,
    grace_period_end_date INTEGER,
    limits TEXT,
    plan_slug TEXT,
    verified_badge INTEGER DEFAULT 0,
    social_links TEXT,
    photo_gallery TEXT,
    organization_type TEXT,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  , latest_update TEXT, latest_update_images TEXT, latest_update_date INTEGER, registration_url TEXT, plan_expires_at INTEGER, grace_period_end_at INTEGER)

non_profits:CREATE TABLE non_profits (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    banner_image_id TEXT,
    profile_image_id TEXT,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    year_of_establishment INTEGER,
    email TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    opening_hours TEXT,
    about_us TEXT,
    latest_updates TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    photo_gallery TEXT,
    latest_update TEXT,
    latest_update_images TEXT,
    latest_update_date INTEGER,
    registration_url TEXT,
    verified_badge INTEGER DEFAULT 0,
    social_links TEXT,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  , rating_average REAL DEFAULT 0, rating_count INTEGER DEFAULT 0, trial_started_at INTEGER, grace_period_end_date INTEGER, subscription_status TEXT DEFAULT 'none', subscription_expires_at INTEGER)

public_sectors:CREATE TABLE public_sectors (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    banner_image_id TEXT,
    profile_image_id TEXT,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    year_of_establishment INTEGER,
    email TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    opening_hours TEXT,
    about_us TEXT,
    latest_updates TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    photo_gallery TEXT,
    latest_update TEXT,
    latest_update_images TEXT,
    latest_update_date INTEGER,
    government_data TEXT,
    registration_url TEXT,
    verified_badge INTEGER DEFAULT 0,
    social_links TEXT,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  , rating_average REAL DEFAULT 0, rating_count INTEGER DEFAULT 0, trial_started_at INTEGER, grace_period_end_date INTEGER, subscription_status TEXT DEFAULT 'none', subscription_expires_at INTEGER, plan_type TEXT, publish_date INTEGER, expiry_date INTEGER)

listings:CREATE TABLE listings (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    listing_type TEXT NOT NULL DEFAULT 'product',
    description TEXT NOT NULL,
    price TEXT,
    condition TEXT,
    location TEXT,
    location_lat REAL,
    location_lng REAL,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    email TEXT,
    image_ids TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    last_renewed_at INTEGER,
    featured INTEGER DEFAULT 0,
    featured_until INTEGER,
    extra_data TEXT,
    created_at INTEGER,
    updated_at INTEGER
  , expires_at INTEGER, plan_expires_at INTEGER, address TEXT, grace_period_end_at INTEGER)

products:CREATE TABLE products (
    id TEXT PRIMARY KEY NOT NULL,
    business_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    product_type TEXT DEFAULT 'product',
    price_fields TEXT,
    specifications TEXT,
    images TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER)

media:CREATE TABLE media (
    id TEXT PRIMARY KEY NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    purpose TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    alt TEXT,
    hash TEXT UNIQUE,
    created_by_id TEXT,
    created_at INTEGER,
    deleted_at INTEGER)

orders:CREATE TABLE orders (
    id TEXT PRIMARY KEY NOT NULL,
    service_package_id TEXT,
    variant_snapshot TEXT NOT NULL,
    type TEXT NOT NULL,
    type_id TEXT,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    paid_date INTEGER,
    expires_at INTEGER,
    admin_notes TEXT,
    created_at INTEGER,
    updated_at INTEGER)

service_packages:CREATE TABLE service_packages (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    service_type TEXT NOT NULL,
    service_relation_to TEXT,
    description TEXT,
    variants TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER)

ad_banners:CREATE TABLE ad_banners (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_id TEXT,
    link_url TEXT,
    link_type TEXT NOT NULL,
    position TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    order_id TEXT,
    is_active INTEGER DEFAULT 1,
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER,
    updated_at INTEGER)

blog_posts:CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image_id TEXT,
    author_id TEXT,
    author_name TEXT,
    status TEXT DEFAULT 'draft',
    tags TEXT,
    published_at INTEGER,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    created_at INTEGER,
    updated_at INTEGER)

user:CREATE TABLE user (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, emailVerified INTEGER DEFAULT 0, phone TEXT, name TEXT NOT NULL, image TEXT, role TEXT DEFAULT 'user', createdAt INTEGER DEFAULT (strftime('%s', 'now')), updatedAt INTEGER DEFAULT (strftime('%s', 'now')))

session:CREATE TABLE session (id TEXT PRIMARY KEY, userId TEXT NOT NULL, token TEXT NOT NULL UNIQUE, expiresAt INTEGER NOT NULL, userAgent TEXT, ipAddress TEXT, createdAt INTEGER DEFAULT (strftime('%s', 'now')), updatedAt INTEGER DEFAULT (strftime('%s', 'now')))

account:CREATE TABLE account (id TEXT PRIMARY KEY, userId TEXT NOT NULL, accountId TEXT NOT NULL, providerId TEXT NOT NULL, accessToken TEXT, refreshToken TEXT, idToken TEXT, accessTokenExpiresAt INTEGER, refreshTokenExpiresAt INTEGER, scope TEXT, password TEXT, createdAt INTEGER DEFAULT (strftime('%s', 'now')), updatedAt INTEGER DEFAULT (strftime('%s', 'now')))

verification:CREATE TABLE verification (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expiresAt INTEGER NOT NULL, createdAt INTEGER DEFAULT (strftime('%s', 'now')))

reviews:CREATE TABLE reviews (
    id TEXT PRIMARY KEY NOT NULL,
    business_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    reply TEXT,
    replied_at INTEGER,
    replied_by TEXT,
    status TEXT DEFAULT 'pending',
    created_at INTEGER,
    updated_at INTEGER)

saved_items:CREATE TABLE saved_items (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    created_at INTEGER)

business_categories:CREATE TABLE business_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER)

non_profit_categories:CREATE TABLE non_profit_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER)

public_sector_categories:CREATE TABLE public_sector_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER)

listing_categories:CREATE TABLE listing_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  , form_fields TEXT)

product_categories:CREATE TABLE product_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    form_fields TEXT,
    created_at INTEGER,
    updated_at INTEGER)

blog_categories:CREATE TABLE blog_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER)

site_settings:CREATE TABLE site_settings (
    id TEXT PRIMARY KEY NOT NULL,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    type TEXT DEFAULT 'string',
    description TEXT,
    is_public INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER)

latest_updates:CREATE TABLE latest_updates (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    type_id TEXT NOT NULL,
    content TEXT NOT NULL,
    image_ids TEXT,
    video_id TEXT,
    created_at INTEGER,
    updated_at INTEGER)
`;

// Parse field names from CREATE TABLE statements
function extractFields(sql) {
  const match = sql.match(/CREATE TABLE \w+ \(([\s\S]+)\)/i);
  if (!match) return {};
  const raw = match[1];
  // Split by comma not inside parentheses
  const fields = {};
  const lines = raw.split(',');
  for (const line of lines) {
    const trimmed = line.trim();
    // Match: field_name TYPE [DEFAULT ...]
    const m = trimmed.match(/^(\w+)\s+(TEXT|INTEGER|REAL|BLOB|NUMERIC)(\s+.*)?$/i);
    if (m) {
      const name = m[1];
      const type = m[2].toUpperCase();
      const extras = m[3] || '';
      fields[name] = { type, extras: extras.trim() };
    }
  }
  return fields;
}

// Parse each table
const tables = {};
const blocks = remoteRaw.trim().split('\n\n');
for (const block of blocks) {
  const colon = block.indexOf(':');
  if (colon === -1) continue;
  const name = block.slice(0, colon).trim();
  const sql = block.slice(colon + 1).trim();
  tables[name] = extractFields(sql);
}

// Now compare with local Drizzle schema
// Let me read the local schema fields from what we know
const localSchema = {
  users: {
    id: 'TEXT PK', email: 'TEXT', emailVerified: 'INTEGER', phone: 'TEXT', name: 'TEXT',
    image: 'TEXT', role: 'TEXT', createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  sessions: {
    id: 'TEXT PK', userId: 'TEXT', token: 'TEXT', expiresAt: 'INTEGER',
    userAgent: 'TEXT', ipAddress: 'TEXT', createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  accounts: {
    id: 'TEXT PK', userId: 'TEXT', accountId: 'TEXT', providerId: 'TEXT',
    accessToken: 'TEXT', refreshToken: 'TEXT', idToken: 'TEXT',
    accessTokenExpiresAt: 'INTEGER', refreshTokenExpiresAt: 'INTEGER',
    scope: 'TEXT', password: 'TEXT', createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  verifications: {
    id: 'TEXT PK', identifier: 'TEXT', value: 'TEXT', expiresAt: 'INTEGER', createdAt: 'INTEGER'
  },
  businesses: {
    // From local schema
    id: 'TEXT PK', title: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    ownerId: 'TEXT NOT NULL', categoryId: 'TEXT',
    status: 'TEXT DEFAULT draft', bannerImageId: 'TEXT', profileImageId: 'TEXT',
    contactName: 'TEXT', contactNumber: 'TEXT', countryCode: 'TEXT DEFAULT +670',
    yearOfEstablishment: 'INTEGER', email: 'TEXT', address: 'TEXT',
    locationLat: 'REAL', locationLng: 'REAL', openingHours: 'TEXT',
    aboutUs: 'TEXT', latestUpdates: 'TEXT', tags: 'TEXT',
    likes: 'INTEGER DEFAULT 0', saves: 'INTEGER DEFAULT 0', shares: 'INTEGER DEFAULT 0',
    ratingAverage: 'REAL DEFAULT 0', ratingCount: 'INTEGER DEFAULT 0',
    planExpiresAt: 'INTEGER', gracePeriodEndDate: 'INTEGER',
    verifiedBadge: 'INTEGER DEFAULT 0', registrationUrl: 'TEXT',
    socialLinks: 'TEXT', photoGallery: 'TEXT',
    latestUpdate: 'TEXT', latestUpdateImages: 'TEXT', latestUpdateDate: 'INTEGER',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  nonProfits: {
    id: 'TEXT PK', title: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    ownerId: 'TEXT NOT NULL', categoryId: 'TEXT',
    status: 'TEXT DEFAULT draft', bannerImageId: 'TEXT', profileImageId: 'TEXT',
    contactName: 'TEXT', contactNumber: 'TEXT', countryCode: 'TEXT DEFAULT +670',
    yearOfEstablishment: 'INTEGER', email: 'TEXT', address: 'TEXT',
    locationLat: 'REAL', locationLng: 'REAL', openingHours: 'TEXT',
    aboutUs: 'TEXT', latestUpdates: 'TEXT', tags: 'TEXT',
    likes: 'INTEGER DEFAULT 0', saves: 'INTEGER DEFAULT 0', shares: 'INTEGER DEFAULT 0',
    verifiedBadge: 'INTEGER DEFAULT 0', registrationUrl: 'TEXT',
    socialLinks: 'TEXT', photoGallery: 'TEXT',
    latestUpdate: 'TEXT', latestUpdateImages: 'TEXT', latestUpdateDate: 'INTEGER',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  publicSectors: {
    id: 'TEXT PK', title: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    ownerId: 'TEXT NOT NULL', categoryId: 'TEXT',
    status: 'TEXT DEFAULT draft', bannerImageId: 'TEXT', profileImageId: 'TEXT',
    contactName: 'TEXT', contactNumber: 'TEXT', countryCode: 'TEXT DEFAULT +670',
    yearOfEstablishment: 'INTEGER', email: 'TEXT', address: 'TEXT',
    locationLat: 'REAL', locationLng: 'REAL', openingHours: 'TEXT',
    aboutUs: 'TEXT', latestUpdates: 'TEXT', tags: 'TEXT',
    likes: 'INTEGER DEFAULT 0', saves: 'INTEGER DEFAULT 0', shares: 'INTEGER DEFAULT 0',
    verifiedBadge: 'INTEGER DEFAULT 0', registrationUrl: 'TEXT',
    socialLinks: 'TEXT', photoGallery: 'TEXT',
    governmentData: 'TEXT',
    latestUpdate: 'TEXT', latestUpdateImages: 'TEXT', latestUpdateDate: 'INTEGER',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  listings: {
    id: 'TEXT PK', title: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    ownerId: 'TEXT NOT NULL', categoryId: 'TEXT NOT NULL',
    status: 'TEXT DEFAULT draft',
    description: 'TEXT NOT NULL', price: 'TEXT', condition: 'TEXT',
    location: 'TEXT', address: 'TEXT',
    locationLat: 'REAL', locationLng: 'REAL',
    contactName: 'TEXT', contactNumber: 'TEXT', countryCode: 'TEXT DEFAULT +670',
    email: 'TEXT', imageIds: 'TEXT', tags: 'TEXT',
    likes: 'INTEGER DEFAULT 0', saves: 'INTEGER DEFAULT 0', views: 'INTEGER DEFAULT 0',
    planExpiresAt: 'INTEGER', gracePeriodEndAt: 'INTEGER', lastRenewedAt: 'INTEGER',
    featured: 'INTEGER DEFAULT 0', featuredUntil: 'INTEGER',
    extraData: 'TEXT',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  products: {
    id: 'TEXT PK', businessId: 'TEXT NOT NULL', categoryId: 'TEXT NOT NULL',
    title: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', productType: 'TEXT DEFAULT product',
    priceFields: 'TEXT', specifications: 'TEXT',
    images: 'TEXT DEFAULT []',
    featured: 'INTEGER DEFAULT 0', active: 'INTEGER DEFAULT 1', sortOrder: 'INTEGER DEFAULT 0',
    views: 'INTEGER DEFAULT 0', likes: 'INTEGER DEFAULT 0', saves: 'INTEGER DEFAULT 0', shares: 'INTEGER DEFAULT 0',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  media: {
    id: 'TEXT PK', r2Key: 'TEXT NOT NULL UNIQUE',
    filename: 'TEXT NOT NULL', mimeType: 'TEXT NOT NULL', size: 'INTEGER NOT NULL',
    width: 'INTEGER', height: 'INTEGER',
    entityType: 'TEXT NOT NULL', entityId: 'TEXT NOT NULL',
    purpose: 'TEXT NOT NULL',
    sortOrder: 'INTEGER DEFAULT 0', alt: 'TEXT',
    hash: 'TEXT UNIQUE',
    createdById: 'TEXT', createdAt: 'INTEGER', deletedAt: 'INTEGER'
  },
  orders: {
    id: 'TEXT PK',
    servicePackageId: 'TEXT NOT NULL', variantId: 'TEXT NOT NULL', variantSnapshot: 'TEXT NOT NULL',
    type: 'TEXT NOT NULL', typeId: 'TEXT',
    userId: 'TEXT NOT NULL',
    amount: 'INTEGER NOT NULL',
    status: 'TEXT DEFAULT pending', paymentMethod: 'TEXT', paidDate: 'INTEGER',
    planExpiresAt: 'INTEGER',
    adminNotes: 'TEXT',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  servicePackages: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    serviceRelationTo: 'TEXT NOT NULL',
    description: 'TEXT',
    variants: 'TEXT NOT NULL',
    isActive: 'INTEGER DEFAULT 1', sortOrder: 'INTEGER DEFAULT 0',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  adBanners: {
    id: 'TEXT PK', title: 'TEXT NOT NULL', description: 'TEXT',
    imageId: 'TEXT', linkUrl: 'TEXT', linkType: 'TEXT NOT NULL',
    position: 'TEXT NOT NULL',
    sortOrder: 'INTEGER DEFAULT 0', orderId: 'TEXT',
    isActive: 'INTEGER DEFAULT 1',
    planExpiresAt: 'INTEGER',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  blogPosts: {
    id: 'TEXT PK', title: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    excerpt: 'TEXT', content: 'TEXT',
    coverImageId: 'TEXT',
    authorId: 'TEXT', authorName: 'TEXT',
    status: 'TEXT DEFAULT draft', tags: 'TEXT',
    publishedAt: 'INTEGER',
    views: 'INTEGER DEFAULT 0', likes: 'INTEGER DEFAULT 0', saves: 'INTEGER DEFAULT 0', shares: 'INTEGER DEFAULT 0',
    metaTitle: 'TEXT', metaDescription: 'TEXT', canonicalUrl: 'TEXT',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  reviews: {
    id: 'TEXT PK', businessId: 'TEXT NOT NULL', userId: 'TEXT NOT NULL',
    rating: 'INTEGER NOT NULL',
    title: 'TEXT', content: 'TEXT',
    reply: 'TEXT', repliedAt: 'INTEGER', repliedBy: 'TEXT',
    status: 'TEXT DEFAULT pending',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  savedItems: {
    id: 'TEXT PK', userId: 'TEXT NOT NULL',
    type: 'TEXT NOT NULL', typeId: 'TEXT NOT NULL',
    createdAt: 'INTEGER'
  },
  businessCategories: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', icon: 'TEXT',
    parentId: 'TEXT',
    sortOrder: 'INTEGER DEFAULT 0', isActive: 'INTEGER DEFAULT 1',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  nonProfitCategories: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', icon: 'TEXT',
    parentId: 'TEXT',
    sortOrder: 'INTEGER DEFAULT 0', isActive: 'INTEGER DEFAULT 1',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  publicSectorCategories: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', icon: 'TEXT',
    parentId: 'TEXT',
    sortOrder: 'INTEGER DEFAULT 0', isActive: 'INTEGER DEFAULT 1',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  listingCategories: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', icon: 'TEXT',
    parentId: 'TEXT',
    sortOrder: 'INTEGER DEFAULT 0', isActive: 'INTEGER DEFAULT 1',
    formFields: 'TEXT',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  productCategories: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', icon: 'TEXT',
    parentId: 'TEXT',
    sortOrder: 'INTEGER DEFAULT 0', isActive: 'INTEGER DEFAULT 1',
    formFields: 'TEXT',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  blogCategories: {
    id: 'TEXT PK', name: 'TEXT NOT NULL', slug: 'TEXT NOT NULL UNIQUE',
    description: 'TEXT', icon: 'TEXT',
    parentId: 'TEXT',
    sortOrder: 'INTEGER DEFAULT 0', isActive: 'INTEGER DEFAULT 1',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  },
  siteSettings: {
    id: 'TEXT PK', key: 'TEXT NOT NULL UNIQUE',
    value: 'TEXT', type: 'TEXT DEFAULT string',
    description: 'TEXT', isPublic: 'INTEGER DEFAULT 0',
    updatedAt: 'INTEGER'
  },
  latestUpdates: {
    id: 'TEXT PK',
    type: 'TEXT NOT NULL', typeId: 'TEXT NOT NULL',
    content: 'TEXT NOT NULL',
    imageIds: 'TEXT', videoId: 'TEXT',
    createdAt: 'INTEGER', updatedAt: 'INTEGER'
  }
};

// Compare each table
const tableMap = {
  user: 'users', session: 'sessions', account: 'accounts', verification: 'verifications',
  businesses: 'businesses', non_profits: 'nonProfits', public_sectors: 'publicSectors',
  listings: 'listings', products: 'products', media: 'media',
  orders: 'orders', service_packages: 'servicePackages', ad_banners: 'adBanners',
  blog_posts: 'blogPosts', reviews: 'reviews', saved_items: 'savedItems',
  business_categories: 'businessCategories', non_profit_categories: 'nonProfitCategories',
  public_sector_categories: 'publicSectorCategories', listing_categories: 'listingCategories',
  product_categories: 'productCategories', blog_categories: 'blogCategories',
  site_settings: 'siteSettings', latest_updates: 'latestUpdates'
};

let output = '## SCHEMA COMPARISON: Local (Drizzle) vs Remote (D1)\n\n';

for (const [remoteName, localName] of Object.entries(tableMap)) {
  const remoteFields = tables[remoteName] || {};
  const localFields = localSchema[localName] || {};
  
  output += `### ${localName} (remote: ${remoteName})\n`;
  
  // Fields in local but NOT in remote
  const onlyLocal = {};
  for (const [k, v] of Object.entries(localFields)) {
    if (!remoteFields[k.replace(/([A-Z])/g, '_$1').toLowerCase()]) {
      onlyLocal[k] = v;
    }
  }
  
  // Fields in remote but NOT in local
  const onlyRemote = {};
  for (const [k, v] of Object.entries(remoteFields)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (!localFields[camel]) {
      onlyRemote[k] = v;
    }
  }
  
  if (Object.keys(onlyLocal).length > 0) {
    output += `**⚠️ LOCAL ONLY (Drizzle has, Remote missing):**\n`;
    for (const [k, v] of Object.entries(onlyLocal)) {
      output += `  - ${k}: ${v}\n`;
    }
  }
  
  if (Object.keys(onlyRemote).length > 0) {
    output += `**⚠️ REMOTE ONLY (Remote has, Local missing):**\n`;
    for (const [k, v] of Object.entries(onlyRemote)) {
      output += `  - ${k} (${v.type})${v.extras ? ' ' + v.extras : ''}\n`;
    }
  }
  
  if (Object.keys(onlyLocal).length === 0 && Object.keys(onlyRemote).length === 0) {
    output += `✅ **MATCH**\n`;
  }
  
  output += `\n`;
}

console.log(output);