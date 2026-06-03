# Schema Review Decisions
# Date: 2026-06-02
# Purpose: 逐一review所有表结构后的最终决策记录

---

## 表: users
- 无修改，remote和local一致
- createdAt/updatedAt: 无DEFAULT，代码层面处理

---

## 表: sessions
- 无修改，remote和local一致
- createdAt/updatedAt: 无DEFAULT，代码层面处理

---

## 表: accounts
- 无修改，remote和local一致
- createdAt/updatedAt: 无DEFAULT，代码层面处理

---

## 表: verifications
- 无修改

---

## 表: businesses

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| views | INTEGER DEFAULT 0 | 0 | 所有页面都需要stats |
| deleted_at | INTEGER | null | 软删除，null=未删除，timestamp=已删除 |

### 本地 schema 需要删除的字段
| 字段 | 说明 |
|------|------|
| gracePeriodEndDate | 不需要，动态计算planExpiresAt+30天 |
| latest_updates (JSON数组) | 废弃，latestUpdates数据统一从latest_updates表读取 |

### Remote 需要删除的字段
| 字段 | 说明 |
|------|------|
| plan_type | 不存储，从orders查询 |
| publish_date | 废弃 |
| expiry_date | 用plan_expires_at |
| subscription_status | 从orders查询 |
| subscription_expires_at | 用plan_expires_at |
| limits | 从variantSnapshot查询 |
| plan_slug | 从orders查询 |
| organization_type | 错误字段，删除 |
| grace_period_end_date | 不需要，动态计算 |
| latest_updates (JSON数组) | 废弃 |

### 逻辑规则
- planExpiresAt初始值=null，付款后同步
- views初始值=0，有浏览时增加
- ratingAverage/ratingCount初始值=0，有新评论时更新
- deleted_at初始值=null，删除时设当前时间戳
- gracePeriodEnd动态计算=planExpiresAt+30天，不单独存储
- latestUpdate/latestUpdateImages/latestUpdateDate保留作为缓存

---

## 表: non_profits

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| views | INTEGER DEFAULT 0 | 0 | 所有页面都需要stats |
| deleted_at | INTEGER | null | 软删除 |

### 本地 schema 需要删除的字段
| 字段 | 说明 |
|------|------|
| latest_updates (JSON数组) | 废弃，latestUpdates数据统一从latest_updates表读取 |

### Remote 需要删除的字段
| 字段 | 说明 |
|------|------|
| rating_average | 非business页面不需要 |
| rating_count | 非business页面不需要 |
| trial_started_at | 免费页面无试用期 |
| grace_period_end_date | 免费页面无grace period |
| subscription_status | 免费页面无订阅 |
| subscription_expires_at | 免费页面无订阅 |
| latest_updates (JSON数组) | 废弃 |

### 逻辑规则
- views初始值=0，有浏览时增加
- likes/saves/shares初始值=0
- deleted_at初始值=null，删除时设当前时间戳

---

## 表: public_sectors

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| views | INTEGER DEFAULT 0 | 0 | 所有页面都需要stats |
| deleted_at | INTEGER | null | 软删除 |

### 本地 schema 需要删除的字段
| 字段 | 说明 |
|------|------|
| rating_average | 非business页面不需要 |
| rating_count | 非business页面不需要 |
| latest_updates (JSON数组) | 废弃，latestUpdates数据统一从latest_updates表读取 |

### Remote 需要删除的字段
| 字段 | 说明 |
|------|------|
| rating_average | 非business页面不需要 |
| rating_count | 非business页面不需要 |
| trial_started_at | 免费页面无试用期 |
| grace_period_end_date | 免费页面无grace period |
| subscription_status | 免费页面无订阅 |
| subscription_expires_at | 免费页面无订阅 |
| plan_type | 免费页面无plan |
| publish_date | 废弃 |
| expiry_date | 废弃 |
| latest_updates (JSON数组) | 废弃 |

### 逻辑规则
- views初始值=0，有浏览时增加
- likes/saves/shares初始值=0
- deleted_at初始值=null，删除时设当前时间戳
- governmentData保留（publicSectors特有）

---

## 表: listings

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| shares | INTEGER DEFAULT 0 | 0 | 所有页面都需要stats |

### 本地 schema 需要删除的字段
| 字段 | 说明 |
|------|------|
| gracePeriodEndAt | 不需要，动态计算planExpiresAt+14天 |

### Remote 需要删除的字段
| 字段 | 说明 |
|------|------|
| listing_type | 废弃，categories已完善 |
| expires_at | 用plan_expires_at |

### 逻辑规则
- planExpiresAt初始值=null（3天免费试用），付款后同步
- gracePeriodEnd动态计算=planExpiresAt+14天，不单独存储
- 续期逻辑：从orders查询，叠加剩余天数
- 每个用户可创建N个listing

---

## 表: products

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| deleted_at | INTEGER | null | 软删除 |

### 逻辑规则
- businessId NOT NULL，必须关联business
- products数量由business plan的skuLimit决定（10/30/60）
- 页面显示"Sold by [business title]"，点击回到business page
- views/likes/saves/shares初始值=0

---

## 表: media

### 无修改
- remote和local完全一致

### media purpose枚举值
- avatar / banner / cover / gallery / thumbnail / content / og-image / video / document / logo

### 数量限制（应用层校验）
- businesses/nonProfits/publicSectors: 最多12图+2视频（含LatestUpdates）
- LatestUpdates: 最多4图+1视频
- products/listings: 最多6图+1视频

---

## 表: orders

### 本地 schema 需要修改的字段
| 字段 | 处理 |
|------|------|
| variantId | 移除，只保留variantSnapshot，需要时从JSON解析 |

### Remote 需要修改的字段
| 字段 | 处理 |
|------|------|
| service_package_id | 设为NOT NULL |
| expires_at | 重命名为plan_expires_at |
| variant_id | 删除 |
| paid_date | 添加（支付确认时间） |

### 逻辑规则
- servicePackageId NOT NULL，必须关联servicePackages
- variantSnapshot存储购买时的完整信息（含id/name/price/duration/limits）
- paidDate记录支付确认时间，用于计算有效期起始点
- planExpiresAt初始值=null，付款后设置
- 续期公式：
  - if(previousOrder.planExpiresAt > now): newPlanExpiresAt = previousOrder.planExpiresAt + newDuration
  - else: newPlanExpiresAt = paidDate + newDuration

---

## 表: service_packages

### Remote 需要修改的字段
| 字段 | 处理 |
|------|------|
| service_type | 删除 |
| service_relation_to | 添加NOT NULL |

### 逻辑规则
- serviceRelationTo: 'business'/'listing'/'ad_banner'
- 扩展性：TEXT字段，可随时加新值，不需要改schema
- variants JSON结构：
  - business: id/name/price/currency/durationValue/durationUnit/limits{skuLimit}
  - listing: id/name/price/currency/durationValue/durationUnit
  - ad_banner: id/name/price/currency/durationValue/durationUnit
- business plans: starter($29月/$290年-10sku)/pro($59/$590-30sku)/max($99/$990-60sku)

---

## 表: ad_banners

### Remote 需要修改的字段
| 字段 | 处理 |
|------|------|
| start_date / end_date | 删除 |
| plan_expires_at | 添加 |

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| startDate | INTEGER | null | Admin设置展示起始日期 |

### 逻辑规则
- planExpiresAt = startDate + selectedDuration
- linkType: 'business'/'listing'/'product'
- position: 'homepage'/'businesses'/'products-services'/'listings'
- isActive初始值=0，startDate到期后自动激活
- orderId付款后生成

---

## 表: reviews

### 无schema修改

### 逻辑规则
- rating: 1-5星
- content: 最大104字符
- status: pending/approved/rejected，初始值pending
- repliedBy: business名称，非用户ID
- 只有businesses有评论功能

---

## 表: saved_items

### Remote 需要修改的字段
| 字段 | 处理 |
|------|------|
| item_type | 重命名为type |
| item_id | 重命名为typeId |

### CHECK约束
- type IN ('businesses', 'listings', 'products')

---

## 表: latest_updates

### CHECK约束
- type IN ('business', 'non_profit', 'public_sector')
- content: 最大255字符
- imageIds: JSON数组，最多4张，应用层校验
- videoId: 单个ID，最多1个

---

## 表: blog_posts

### 本地 schema 需要添加的字段
| 字段 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| featured | INTEGER DEFAULT 0 | 0 | 置顶文章 |

### 逻辑规则
- status: draft/published/deleted，初始值draft
- publishedAt: 发布时间，未发布时为null

---

## 表: blog_categories

### 无修改

### 逻辑规则
- 最多两级分类
- parentId = null为顶级

---

## 表: site_settings

### 本地 schema 需要添加的字段
| 字段 | 类型 | 说明 |
|------|------|------|
| createdAt | INTEGER | 单例配置创建时间 |

---

## 分类表（统一规则）

### business_categories
- 最多两级，常见行业二级分类
- 无form_fields

### non_profit_categories
- 最多两级，独立分类
- 无form_fields

### public_sector_categories
- 最多两级，政府机构分类
- 无form_fields

### listing_categories
- 最多两级，分类广告
- formFields: 各分类特有字段（车→里程/排量，房→卧室/浴室等）

### product_categories
- 最多两级，电商分类
- formFields: 各分类特有字段（电子产品→品牌/型号等）

---

## 孤儿表（删除）
- business_pages: 0行，删除
- categories: 0行，删除

---

## form_fields数据完整性检查
- listing_categories: 99个分类，form_fields需覆盖所有常见字段（车辆/房产/电子等）
- product_categories: form_fields需覆盖所有常见电商字段

---

## 媒体数量限制（应用层校验）

| 实体 | 图片上限 | 视频上限 |
|------|----------|----------|
| businesses/nonProfits/publicSectors | 12张（含LatestUpdates） | 2个（含LatestUpdates） |
| LatestUpdates（独立约束） | 4张 | 1个 |
| products | 6张 | 1个 |
| listings | 6张 | 1个 |