/**
 * Unified Database Schema
 * TimorUp
 * Last updated: 2026-06-01
 *
 * Schema Design:
 * - 5 Detail Pages: businesses, nonProfits, publicSectors, listings, products
 * - All 5 pages have: views, likes, saves, shares stats
 * - businesses, nonProfits, publicSectors share similar structure (reviews only for businesses)
 * - products belong to one business (businessId NOT NULL)
 * - listings are independent (ownerId → user), have expiresAt for trial period
 * - All entity slugs must be UNIQUE (SEO requirement)
 * - All categoryId fields must NOT NULL (entities must be categorized)
 *
 * Categories: 5 independent tables (businessCategories, nonProfitCategories, 
 *             publicSectorCategories, listingCategories, productCategories)
 *             Each has unique formFields structure per entity type
 */
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

// ============================================
// Users & Auth
// ============================================

export const users = sqliteTable("user", {
  id: text().primaryKey().notNull(),
  email: text().notNull(),
  emailVerified: integer("emailVerified").default(0),
  phone: text(),
  name: text().notNull(),
  image: text(),
  role: text().default("user"),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
},
(table) => [
  index("user_role_idx").on(table.role),
  uniqueIndex("user_email_unique").on(table.email),
]);

export const sessions = sqliteTable("session", {
  id: text().primaryKey().notNull(),
  userId: text("userId").notNull(),
  token: text().notNull(),
  expiresAt: integer("expiresAt").notNull(),
  userAgent: text("userAgent"),
  ipAddress: text("ipAddress"),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
},
(table) => [
  index("session_user_idx").on(table.userId),
  uniqueIndex("session_token_unique").on(table.token),
]);

export const accounts = sqliteTable("account", {
  id: text().primaryKey().notNull(),
  userId: text("userId").notNull(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt"),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt"),
  password: text("password"),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
},
(table) => [
  index("account_user_idx").on(table.userId),
]);

export const verifications = sqliteTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer("expiresAt").notNull(),
  createdAt: integer("createdAt"),
},
(table) => [
  index("verification_expires_idx").on(table.expiresAt),
]);
// ============================================
// Categories (4 independent tables)
// ============================================

export const businessCategories = sqliteTable("business_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("business_categories_slug_idx").on(table.slug),
  index("business_categories_parent_idx").on(table.parentId),
]);

export const nonProfitCategories = sqliteTable("non_profit_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("non_profit_categories_slug_idx").on(table.slug),
  index("non_profit_categories_parent_idx").on(table.parentId),
]);

export const publicSectorCategories = sqliteTable("public_sector_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("public_sector_categories_slug_idx").on(table.slug),
  index("public_sector_categories_parent_idx").on(table.parentId),
]);

export const listingCategories = sqliteTable("listing_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  // JSON 配置 - 分类特有的表单字段，供 admin 后台可编辑
  // 结构: [{ name: "price", type: "number", label: "Price", required: true }, ...]
  formFields: text("form_fields"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("listing_categories_slug_idx").on(table.slug),
  index("listing_categories_parent_idx").on(table.parentId),
]);

// ============================================
// Media
// R2 structure: /pages/, /general/, /businesses/{id}/, /listings/{id}/,
//              /non-profits/{id}/, /public-sectors/{id}/, /blog/{id}/, /users/{id}/
// r2Key format: {entityType}/{entityId}/{purpose}_{uuid}.{ext}
// ============================================

export const media = sqliteTable("media", {
  id: text().primaryKey().notNull(),
  r2Key: text("r2_key").notNull().unique(),  // R2 storage path (e.g., businesses/biz-123/avatar_abc123.jpg)

  // File info
  filename: text().notNull(),                  // Original filename
  mimeType: text("mime_type").notNull(),      // image/jpeg, video/mp4
  size: integer().notNull(),                   // bytes
  width: integer(),                            // Image width
  height: integer(),                           // Image height

  // Association
  entityType: text("entity_type").notNull(),  // 'pages' | 'general' | 'businesses' | 'listings' | 'non-profits' | 'public-sectors' | 'blog' | 'users'
  entityId: text("entity_id").notNull(),      // Entity ID

  // Purpose
  purpose: text().notNull(),                  // 'avatar' | 'banner' | 'cover' | 'gallery' | 'logo' | 'icon' | 'og-image' | 'content'

  // Sorting (for gallery)
  sortOrder: integer("sort_order").default(0),

  // SEO
  alt: text(),                                // Alt text for accessibility

  // Audit
  hash: text().unique(),                      // Content hash for deduplication
  createdById: text("created_by_id"),
  createdAt: integer("created_at"),

  // Soft delete
  deletedAt: integer("deleted_at"),            // null = active, timestamp = deleted
},
(table) => [
  uniqueIndex("media_r2_key_idx").on(table.r2Key),
  index("media_entity_idx").on(table.entityType, table.entityId),
  index("media_purpose_idx").on(table.purpose),
  index("media_hash_idx").on(table.hash),
  index("media_deleted_idx").on(table.deletedAt),
]);

// ============================================
// Entity Tables (4 independent tables)
/**
 * Businesses (Paid Business Pages)
 * 
 * Subscription Model:
 * - Plans: Different plans with different product limits (e.g., starter, pro)
 * - Duration: Monthly or yearly renewal
 * - Grace Period: 30 days after expiry (only name visible)
 * - Deletion: After grace period, business + all products are deleted
 */
// Businesses (Paid Business Pages)
// Subscription Model:
// - Plans: Different plans with product limits stored in servicePackages
// - Query current plan from orders table: SELECT * FROM orders WHERE type='business' AND typeId=? AND status='paid' ORDER BY planExpiresAt DESC LIMIT 1
// - Duration: Monthly or yearly renewal
// - Grace Period: 30 days after expiry (read-only)
// - Deletion: After grace period, business + all products are deleted
export const businesses = sqliteTable("businesses", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),              // draft | active | suspended | deleted
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("about_us"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  shares: integer().default(0),
  views: integer().default(0),
  ratingAverage: real("rating_average").default(0),
  ratingCount: integer("rating_count").default(0),
  // 订阅有效期 (planExpiresAt初始值=null，付款后从orders表同步)
  // grace period动态计算=planExpiresAt+30天，不单独存储
  planExpiresAt: integer("plan_expires_at"),
  // 认证
  verifiedBadge: integer("verified_badge").default(0),
  registrationUrl: text("registration_url"),
  socialLinks: text("social_links"),
  photoGallery: text("photo_gallery"),
  // 最新动态 (缓存字段，数据来源: latest_updates表)
  latestUpdate: text("latest_update"),
  latestUpdateImages: text("latest_update_images"),
  latestUpdateDate: integer("latest_update_date"),
  // 软删除 (null=未删除，timestamp=已删除)
  deletedAt: integer("deleted_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("businesses_slug_idx").on(table.slug),
  index("businesses_owner_idx").on(table.ownerId),
  index("businesses_status_idx").on(table.status),
  index("businesses_category_idx").on(table.categoryId),
  index("businesses_plan_expires_idx").on(table.planExpiresAt),
]);
/**
 * Non-Profits (Free Organization Pages)
 * 
 * - Free to create, no subscription
 * - No reviews, no products/services
 * - Just basic organization info with photo gallery
 */
// Non-profit organizations - free pages
export const nonProfits = sqliteTable("non_profits", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),              // draft | active | deleted
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  aboutUs: text("aboutUs"),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  shares: integer().default(0),
  // 认证
  verifiedBadge: integer("verified_badge").default(0),
  registrationUrl: text("registration_url"),
  photoGallery: text("photo_gallery"),
  socialLinks: text("social_links"),
  latestUpdate: text("latest_update"),
  latestUpdateImages: text("latest_update_images"),
  latestUpdateDate: integer("latest_update_date"),
  // 软删除 (null=未删除，timestamp=已删除)
  deletedAt: integer("deleted_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("non_profits_slug_idx").on(table.slug),
  index("non_profits_owner_idx").on(table.ownerId),
  index("non_profits_status_idx").on(table.status),
  index("non_profits_category_idx").on(table.categoryId),
]);
/**
 * Public Sectors (Free Government Pages)
 * 
 * - Free to create, no subscription
 * - No reviews, no products/services
 * - Government-specific data in governmentData JSON
 */
// Government/public organization pages - free
export const publicSectors = sqliteTable("public_sectors", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id"),
  status: text().default("draft"),              // draft | active | deleted
  bannerImageId: text("banner_image_id"),
  profileImageId: text("profile_image_id"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  yearOfEstablishment: integer("year_of_establishment"),
  email: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  openingHours: text("opening_hours"),
  aboutUs: text("aboutUs"),
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  shares: integer().default(0),
  // 认证
  verifiedBadge: integer("verified_badge").default(0),
  registrationUrl: text("registration_url"),
  socialLinks: text("social_links"),
  photoGallery: text("photo_gallery"),
  // 政府特有数据 (JSON)
  governmentData: text("government_data"),
  // 最新动态 (缓存字段，数据来源: latest_updates表)
  latestUpdate: text("latest_update"),
  latestUpdateImages: text("latest_update_images"),
  latestUpdateDate: integer("latest_update_date"),
  // 软删除 (null=未删除，timestamp=已删除)
  deletedAt: integer("deleted_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("public_sectors_slug_idx").on(table.slug),
  index("public_sectors_owner_idx").on(table.ownerId),
  index("public_sectors_status_idx").on(table.status),
  index("public_sectors_category_idx").on(table.categoryId),
]);
/**
 * Listings (Paid Classified Ads)
 * 
 * - First 3 days free trial
 * - Renewal options: 7 days, 30 days, 365 days
 * - Grace Period: 14 days after expiry
 * - Deletion: After grace period, listing is deleted
 */
// Classified ads with renewal system
// Classified ads with renewal system
// listingType derived from category.parentId: parentId = 'vehicles' → 'vehicle', 'for-sale' → 'product', etc.
export const listings = sqliteTable("listings", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  ownerId: text("owner_id").notNull(),
  categoryId: text("category_id").notNull(),  // Must select a category
  status: text().default("draft"),              // draft | active | expired | deleted
  description: text().notNull(),
  price: text(),
  condition: text(),
  location: text(),
  address: text(),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  countryCode: text("country_code").default("+670"),
  email: text(),
  imageIds: text("image_ids"),                 // JSON array: 6 images + 1 video
  tags: text(),
  // 统计
  likes: integer().default(0),
  saves: integer().default(0),
  views: integer().default(0),
  shares: integer().default(0),
  // 有效期/续费 (planExpiresAt初始值=null，3天免费试用，付款后从orders表同步)
  // grace period动态计算=planExpiresAt+14天，不单独存储
  planExpiresAt: integer("plan_expires_at"),
  lastRenewedAt: integer("last_renewed_at"),
  // Admin 设置
  featured: integer().default(0),
  featuredUntil: integer("featured_until"),
  // 分类特有字段 (JSON: category-specific fields resolved via resolveFormFields)
  extraData: text("extra_data"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("listings_slug_idx").on(table.slug),
  index("listings_owner_idx").on(table.ownerId),
  index("listings_category_idx").on(table.categoryId),
  index("listings_expires_idx").on(table.planExpiresAt),
]);
// ============================================
// ============================================
// Latest Updates (for business/non_profit/public_sector)
// Each entity has ONE update record that can be edited/deleted
// Limit: 104 chars content, max 4 images, 1 video, once per day
// ============================================

export const latestUpdates = sqliteTable("latest_updates", {
  id: text().primaryKey().notNull(),
  type: text().notNull(),                    // 'business' | 'non_profit' | 'public_sector'
  typeId: text("type_id").notNull(),         // entity ID
  content: text().notNull(),                // max 104 chars
  imageIds: text("image_ids"),               // JSON array, max 4 media IDs
  videoId: text("video_id"),                 // 1 video media ID
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  // Each entity has only ONE update record (UPSERT)
  uniqueIndex("latest_updates_unique").on(table.type, table.typeId),
  index("latest_updates_type_idx").on(table.type),
  index("latest_updates_type_id_idx").on(table.typeId),
]);

/**
 * Product Categories (for businesses' SKUs)
 * 
 * 所有 business 共享的产品分类（非每个 business 独立）
 * 42 categories with formFields for type-specific fields
 * formFields JSON: [{ name: "brand", type: "text", label: "Brand", required: false }, ...]
 */
// Product Categories = global shared categories for products
export const productCategories = sqliteTable("product_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  formFields: text("form_fields"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("product_categories_slug_idx").on(table.slug),
  index("product_categories_parent_idx").on(table.parentId),
]);

// ============================================
// Products (for businesses)
// 每个 product 属于一个 category，category 的 formFields 定义该分类的价格字段
// priceFields JSON 存储用户输入的价格值（来自 category 的 formFields）
// specifications JSON 存储分类特有的属性（品牌、型号、年份等）
// ============================================

export const products = sqliteTable("products", {
  id: text().primaryKey().notNull(),
  businessId: text("business_id").notNull(),     // 每个 product 必须属于一个 business
  categoryId: text("category_id").notNull(),      // NOT NULL - 必须选择分类
  title: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  productType: text("product_type").default("product"),  // 'product' | 'service'
  priceFields: text("price_fields"),
  specifications: text(),
  images: text().default("[]"),
  featured: integer().default(0),
  active: integer().default(1),
  sortOrder: integer("sort_order").default(0),
  // 统计
  views: integer().default(0),
  likes: integer().default(0),
  saves: integer().default(0),
  shares: integer().default(0),
  // 软删除 (null=未删除，timestamp=已删除)
  deletedAt: integer("deleted_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("products_slug_idx").on(table.slug),
  index("products_business_idx").on(table.businessId),
  index("products_category_idx").on(table.categoryId),
  index("products_active_idx").on(table.active),
]);

// ============================================
// Reviews (for businesses)
// ============================================

export const reviews = sqliteTable("reviews", {
  id: text().primaryKey().notNull(),
  businessId: text("business_id").notNull(),      // FK to businesses
  userId: text("user_id").notNull(),              // FK to users
  rating: integer().notNull(),                    // 1-5 颗星
  title: text(),
  content: text(),                                // max 255 chars
  reply: text(),                                  // business 回复
  repliedAt: integer("replied_at"),
  repliedBy: text("replied_by"),                  // business name (不是 user name)
  status: text().default("pending"),             // pending | approved | rejected
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("reviews_business_idx").on(table.businessId),
  index("reviews_user_idx").on(table.userId),
  index("reviews_status_idx").on(table.status),
  uniqueIndex("reviews_user_business_idx").on(table.userId, table.businessId),
]);
/**
 * Orders (Service Package Purchases)
 * 
 * 存储每次购买/续费记录。
 * variantSnapshot 保存购买时的完整信息（不随 servicePackage 变化）。
 * 如果后来修改了 servicePackages，已购买用户权益不受影响。
 * 
 * 查找当前生效 Plan 的规则：
 *   SELECT * FROM orders WHERE type=? AND typeId=? AND status='paid'
 *   ORDER BY planExpiresAt DESC LIMIT 1
 * 续期公式：new.planExpiresAt = max(now, old.planExpiresAt) + duration
 * 剩余时间自动累加，新 order 的 planExpiresAt 永远 ≥ 旧 order。
 */
// Orders = payment records
export const orders = sqliteTable("orders", {
  id: text().primaryKey().notNull(),
  // 关联 service package
  servicePackageId: text("service_package_id").notNull(),  // FK to service_packages
  // 购买时快照 - 不随 servicePackage 变化 (variantId从JSON内解析)
  variantSnapshot: text("variant_snapshot").notNull(),  // JSON包含id/name/price/duration/limits
  // 关联实体
  type: text().notNull(),                           // 'business' | 'listing' | 'ad_banner'
  typeId: text("type_id"),                          // entity ID
  userId: text("user_id").notNull(),
  // 付款
  amount: integer().notNull(),                      // 分
  status: text("status").default("pending"),        // pending | paid | cancelled | refunded
  paymentMethod: text("payment_method"),
  paidDate: integer("paid_date"),                   // 支付确认时间戳，用于计算有效期起始点
  // 有效期 (planExpiresAt初始值=null，付款后设置)
  // 续期公式: if(previousPlanExpiresAt>now): newPlanExpiresAt=previousPlanExpiresAt+newDuration; else: newPlanExpiresAt=paidDate+newDuration
  planExpiresAt: integer("plan_expires_at"),
  adminNotes: text("admin_notes"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("orders_service_package_idx").on(table.servicePackageId),
  index("orders_type_idx").on(table.type),
  index("orders_type_id_idx").on(table.typeId),
  index("orders_user_idx").on(table.userId),
  index("orders_status_idx").on(table.status),
  index("orders_expires_idx").on(table.planExpiresAt),
]);
/**
 * Service Packages (SKUs for Paid Services)
 * 
 * serviceRelationTo 决定此套餐用于哪个实体：
 * - 'business':  Business Page 订阅套餐
 * - 'listing':   Listing 续期套餐
 * - 'ad_banner': Ad Banner 广告套餐
 * 
 * variants JSON 结构根据 serviceRelationTo 不同：
 * 
 * business: [{
 *   id: "starter-monthly", name: "Starter Monthly",
 *   price: 2900, currency: "USD",
 *   durationValue: 1, durationUnit: "month",
 *   limits: { skuLimit: 10 }                     // 不同 plan 的 product 数量限制不同
 * }]
 * 
 * listing: [{
 *   id: "7days", name: "7 Days",
 *   price: 500, currency: "USD",
 *   durationValue: 7, durationUnit: "day"
 *   // 媒体限制为全局常量 (6 images / 1 video)，不在这里定义
 * }]
 * 
 * ad_banner: [{
 *   id: "homepage-week", name: "Homepage 7 Days",
 *   price: 5000, currency: "USD",
 *   durationValue: 7, durationUnit: "day",
 *   limits: { position: "homepage", maxBanners: 4 }
 * }]
 */
// Service Packages = paid service SKUs
export const servicePackages = sqliteTable("service_packages", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),                        // "Business Plans", "Listing Renewals"
  slug: text().notNull().unique(),
  serviceRelationTo: text("service_relation_to").notNull(), // 'business' | 'listing' | 'ad_banner'
  description: text(),
  variants: text("variants").notNull(),          // JSON array (结构见上方注释)
  isActive: integer("is_active").default(1),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("service_packages_slug_idx").on(table.slug),
  index("service_packages_relation_idx").on(table.serviceRelationTo),
  index("service_packages_active_idx").on(table.isActive),
]);
// Alias for backward compatibility
export const plans = servicePackages;
/**
 * Saved Items (Bookmarks)
 * 
 * 目前支持: businesses, listings
 * 可扩展: products (business product pages)
 */
// Saved Items = bookmarks
export const savedItems = sqliteTable("saved_items", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  type: text().notNull(),                  // 'businesses' | 'listings' | 'products'
  typeId: text("type_id").notNull(),         // entity ID
  createdAt: integer("created_at"),
},
(table) => [
  index("saved_items_user_idx").on(table.userId),
  index("saved_items_type_idx").on(table.type),
  index("saved_items_type_id_idx").on(table.typeId),
  uniqueIndex("saved_items_user_type_typeId_idx").on(table.userId, table.type, table.typeId),
]);

// Ad Banners (Promotional Banners)
// Subscription-based: planExpiresAt for duration
// linkType: business | listing | product
export const adBanners = sqliteTable("ad_banners", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),                          // admin 备注
  imageId: text("image_id"),
  linkUrl: text("link_url"),                 // slug
  linkType: text("link_type").notNull(),     // 'business' | 'listing' | 'product'
  position: text().notNull(),                // 'homepage' | 'businesses' | 'products-services' | 'listings'
  sortOrder: integer("sort_order").default(0), // 越大越靠前
  orderId: text("order_id"),                  // FK → orders.id (需付款后生成)
  isActive: integer("is_active").default(0), // 初始值0，startDate到期后自动激活
  startDate: integer("start_date"),            // Admin设置展示起始日期
  // 有效期: planExpiresAt = startDate + duration
  planExpiresAt: integer("plan_expires_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("ad_banners_position_idx").on(table.position),
  index("ad_banners_active_idx").on(table.isActive),
  index("ad_banners_order_idx").on(table.orderId),
]);

/**
 * Blog Categories
 */
// Blog Categories
export const blogCategories = sqliteTable("blog_categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("blog_categories_slug_idx").on(table.slug),
  index("blog_categories_parent_idx").on(table.parentId),
]);

// ============================================
// Blog Posts
// ============================================

export const blogPosts = sqliteTable("blog_posts", {
  id: text().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  excerpt: text(),
  content: text(),
  coverImageId: text("cover_image_id"),
  authorId: text("author_id"),
  authorName: text("author_name"),
  status: text().default("draft"),
  tags: text(),
  publishedAt: integer("published_at"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  canonicalUrl: text("canonical_url"),
  // 统计
  views: integer().default(0),
  likes: integer().default(0),
  saves: integer().default(0),
  shares: integer().default(0),
  // 置顶
  featured: integer("featured").default(0),
},
(table) => [
  uniqueIndex("blog_posts_slug_idx").on(table.slug),
  index("blog_posts_status_idx").on(table.status),
  index("blog_posts_author_idx").on(table.authorId),
  index("blog_posts_cover_image_idx").on(table.coverImageId),
  index("blog_posts_published_at_idx").on(table.publishedAt),
]);
// Site Settings
// ============================================

export const siteSettings = sqliteTable("site_settings", {
  id: text().primaryKey().notNull(),
  key: text().notNull().unique(),
  value: text(),
  type: text().default("string"),
  description: text(),
  isPublic: integer("is_public").default(0),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  uniqueIndex("site_settings_key_idx").on(table.key),
]);

