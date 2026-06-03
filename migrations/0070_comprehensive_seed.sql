-- Comprehensive seed v2

-- ============================================
-- BUSINESS CATEGORIES
-- ============================================
INSERT OR IGNORE INTO business_categories (id, name, slug, icon, description, sort_order) VALUES
('cat-restaurants', 'Restaurants & Cafes', 'restaurants-cafes', '🍽️', 'Food, drinks, dining experiences', 1),
('cat-hotels', 'Hotels & Accommodation', 'hotels-accommodation', '🏨', 'Hotels, guesthouses, lodges', 2),
('cat-shops', 'Shops & Retail', 'shops-retail', '🛍️', 'Retail stores and shops', 3),
('cat-services', 'Services', 'services', '🔧', 'Professional services', 4),
('cat-beauty', 'Beauty & Wellness', 'beauty-wellness', '💄', 'Salons, spas, wellness', 5),
('cat-transport', 'Transport & Travel', 'transport-travel', '🚗', 'Tours, transport, car rental', 6),
('cat-real-estate', 'Real Estate', 'real-estate', '🏠', 'Property sales and rentals', 7),
('cat-education', 'Education', 'education', '📚', 'Schools, tutoring, training', 8),
('cat-health', 'Health & Medical', 'health-medical', '🏥', 'Clinics, pharmacies, doctors', 9),
('cat-construction', 'Construction & Trades', 'construction-trades', '🔨', 'Building, plumbing, electrical', 10);

-- ============================================
-- PRODUCT CATEGORIES
-- ============================================
INSERT OR IGNORE INTO product_categories (id, name, slug, icon, description, sort_order) VALUES
('prod-cat-electronics', 'Electronics', 'electronics', '📱', 'Phones, computers, gadgets', 1),
('prod-cat-clothing', 'Clothing & Fashion', 'clothing-fashion', '👕', 'Clothes, shoes, accessories', 2),
('prod-cat-home', 'Home & Garden', 'home-garden', '🏡', 'Furniture, decor, garden', 3),
('prod-cat-food', 'Food & Beverages', 'food-beverages', '🍎', 'Local food, drinks, snacks', 4),
('prod-cat-beauty', 'Beauty & Personal Care', 'beauty-personal-care', '💄', 'Cosmetics, skincare, grooming', 5),
('prod-cat-automotive', 'Automotive', 'automotive', '🚗', 'Car parts, accessories, tools', 6),
('prod-cat-sports', 'Sports & Outdoors', 'sports-outdoors', '⚽', 'Sports equipment, outdoor gear', 7),
('prod-cat-baby', 'Baby & Kids', 'baby-kids', '👶', 'Toys, baby products, kids items', 8),
('prod-cat-books', 'Books & Stationery', 'books-stationery', '📚', 'Books, office, school supplies', 9),
('prod-cat-handcraft', 'Handcrafts & Art', 'handcrafts-art', '🎨', 'Local crafts, art, handmade items', 10);

-- ============================================
-- NON-PROFIT CATEGORIES
-- ============================================
INSERT OR IGNORE INTO non_profit_categories (id, name, slug, icon, description, sort_order) VALUES
('np-cat-education', 'Education & Training', 'education-training', '📚', 'Schools, literacy, vocational training', 1),
('np-cat-health', 'Health & Wellbeing', 'health-wellbeing', '🏥', 'Healthcare, mental health, support', 2),
('np-cat-environment', 'Environment & Conservation', 'environment-conservation', '🌱', 'Environmental protection, sustainability', 3),
('np-cat-humanitarian', 'Humanitarian Aid', 'humanitarian-aid', '🤝', 'Disaster relief, emergency support', 4),
('np-cat-women', 'Women Empowerment', 'women-empowerment', '👩', 'Women rights, gender equality', 5),
('np-cat-youth', 'Youth Development', 'youth-development', '👦', 'Youth programs, sports, mentorship', 6),
('np-cat-culture', 'Culture & Arts', 'culture-arts', '🎭', 'Cultural preservation, arts', 7),
('np-cat-rights', 'Human Rights', 'human-rights', '⚖️', 'Advocacy, legal aid, rights', 8),
('np-cat-community', 'Community Development', 'community-development', '🏘️', 'Local community projects', 9),
('np-cat-religion', 'Religious & Faith', 'religious-faith', '🕌', 'Religious organizations, churches', 10);

-- ============================================
-- PUBLIC SECTOR CATEGORIES
-- ============================================
INSERT OR IGNORE INTO public_sector_categories (id, name, slug, icon, description, sort_order) VALUES
('ps-cat-ministries', 'Government Ministries', 'government-ministries', '🏛️', 'National ministries and departments', 1),
('ps-cat-municipal', 'Municipal Services', 'municipal-services', '🏘️', 'Municipalities and local government', 2),
('ps-cat-education', 'Public Education', 'public-education', '🎓', 'Public schools and universities', 3),
('ps-cat-health', 'Public Health', 'public-health', '🏥', 'Hospitals and public health facilities', 4),
('ps-cat-police', 'Police & Security', 'police-security', '👮', 'Police, security, defense', 5),
('ps-cat-justice', 'Justice & Courts', 'justice-courts', '⚖️', 'Courts, legal system, prisons', 6),
('ps-cat-transport', 'Public Transport', 'public-transport', '🚌', 'Public transportation services', 7),
('ps-cat-utilities', 'Utilities', 'utilities', '💧', 'Water, electricity, telecom', 8),
('ps-cat-embassy', 'Embassies & Consulates', 'embassies-consulates', '🏳️', 'Foreign embassies and consulates', 9),
('ps-cat-culture', 'Cultural Institutions', 'cultural-institutions', '🎭', 'Museums, libraries, cultural centers', 10);

-- ============================================
-- MEDIA (using real schema: r2_key, filename, etc)
-- ============================================
INSERT OR IGNORE INTO media (id, r2_key, filename, mime_type, size, width, height, entity_type, purpose, sort_order, alt, created_by_id, created_at) VALUES
('media-001', 'business/01-pizza-restaurant', 'pizza-restaurant.jpg', 'image/jpeg', 102400, 800, 600, 'business', 'profile', 0, 'Pizza restaurant', 'user-001', 1717000000),
('media-002', 'business/02-coffee-shop', 'coffee-shop.jpg', 'image/jpeg', 98304, 800, 600, 'business', 'profile', 0, 'Coffee shop', 'user-001', 1717000000),
('media-003', 'business/03-hotel', 'hotel.jpg', 'image/jpeg', 120000, 800, 600, 'business', 'profile', 0, 'Hotel', 'user-002', 1717000000),
('media-004', 'business/04-salon', 'salon.jpg', 'image/jpeg', 110000, 800, 600, 'business', 'profile', 0, 'Salon', 'user-003', 1717000000),
('media-005', 'business/05-grocery', 'grocery.jpg', 'image/jpeg', 105000, 800, 600, 'business', 'profile', 0, 'Grocery', 'user-001', 1717000000),
('media-006', 'product/06-coffee-beans', 'coffee-beans.jpg', 'image/jpeg', 95000, 800, 600, 'product', 'gallery', 0, 'Coffee beans', 'user-001', 1717000000),
('media-007', 'product/07-smartphone', 'smartphone.jpg', 'image/jpeg', 100000, 800, 600, 'product', 'gallery', 0, 'Smartphone', 'user-002', 1717000000),
('media-008', 'product/08-sneakers', 'sneakers.jpg', 'image/jpeg', 90000, 800, 600, 'product', 'gallery', 0, 'Sneakers', 'user-003', 1717000000),
('media-009', 'product/09-headphones', 'headphones.jpg', 'image/jpeg', 85000, 800, 600, 'product', 'gallery', 0, 'Headphones', 'user-001', 1717000000),
('media-010', 'product/10-laptop', 'laptop.jpg', 'image/jpeg', 115000, 800, 600, 'product', 'gallery', 0, 'Laptop', 'user-002', 1717000000),
('media-011', 'product/11-watch', 'watch.jpg', 'image/jpeg', 75000, 800, 600, 'product', 'gallery', 0, 'Watch', 'user-003', 1717000000),
('media-012', 'product/12-backpack', 'backpack.jpg', 'image/jpeg', 80000, 800, 600, 'product', 'gallery', 0, 'Backpack', 'user-001', 1717000000),
('media-013', 'business/13-resort', 'resort.jpg', 'image/jpeg', 130000, 800, 600, 'business', 'profile', 0, 'Beach resort', 'user-002', 1717000000),
('media-014', 'business/14-gym', 'gym.jpg', 'image/jpeg', 110000, 800, 600, 'business', 'profile', 0, 'Gym', 'user-003', 1717000000),
('media-015', 'business/15-construction', 'construction.jpg', 'image/jpeg', 125000, 800, 600, 'business', 'profile', 0, 'Construction', 'user-001', 1717000000),
('media-016', 'business/16-diving', 'diving.jpg', 'image/jpeg', 115000, 800, 600, 'business', 'profile', 0, 'Diving center', 'user-002', 1717000000),
('media-017', 'business/17-tour', 'tour.jpg', 'image/jpeg', 105000, 800, 600, 'business', 'profile', 0, 'Tour agency', 'user-003', 1717000000),
('media-018', 'product/18-beach', 'beach.jpg', 'image/jpeg', 130000, 800, 600, 'product', 'gallery', 0, 'Beach', 'user-001', 1717000000),
('media-019', 'product/19-farm', 'farm.jpg', 'image/jpeg', 110000, 800, 600, 'product', 'gallery', 0, 'Farm produce', 'user-002', 1717000000),
('media-020', 'product/20-coffee', 'coffee.jpg', 'image/jpeg', 95000, 800, 600, 'product', 'gallery', 0, 'Coffee', 'user-003', 1717000000),
('media-021', 'business/21-restaurant', 'restaurant-2.jpg', 'image/jpeg', 108000, 800, 600, 'business', 'profile', 0, 'Restaurant', 'user-001', 1717000000),
('media-022', 'product/22-finedining', 'finedining.jpg', 'image/jpeg', 120000, 800, 600, 'product', 'gallery', 0, 'Fine dining', 'user-002', 1717000000),
('media-023', 'business/23-bakery', 'bakery.jpg', 'image/jpeg', 95000, 800, 600, 'business', 'profile', 0, 'Bakery', 'user-003', 1717000000),
('media-024', 'product/24-burger', 'burger.jpg', 'image/jpeg', 100000, 800, 600, 'product', 'gallery', 0, 'Burger', 'user-001', 1717000000),
('media-025', 'product/25-platter', 'platter.jpg', 'image/jpeg', 105000, 800, 600, 'product', 'gallery', 0, 'Food platter', 'user-002', 1717000000),
('media-026', 'product/26-localfood', 'localfood.jpg', 'image/jpeg', 110000, 800, 600, 'product', 'gallery', 0, 'Local food', 'user-003', 1717000000),
('media-027', 'business/27-cafe', 'cafe.jpg', 'image/jpeg', 100000, 800, 600, 'business', 'profile', 0, 'Cafe interior', 'user-001', 1717000000),
('media-028', 'business/28-beachbar', 'beachbar.jpg', 'image/jpeg', 110000, 800, 600, 'business', 'profile', 0, 'Beach bar', 'user-002', 1717000000),
('media-029', 'business/29-conference', 'conference.jpg', 'image/jpeg', 95000, 800, 600, 'business', 'profile', 0, 'Conference center', 'user-003', 1717000000),
('media-030', 'business/30-hotel', 'hotel-2.jpg', 'image/jpeg', 115000, 800, 600, 'business', 'profile', 0, 'Hotel', 'user-001', 1717000000);

-- ============================================
-- ADDITIONAL BUSINESSES (8 more)
-- ============================================
INSERT OR IGNORE INTO businesses (id, owner_id, category_id, title, slug, status, contact_name, contact_number, country_code, year_of_establishment, email, address, about_us, opening_hours, plan_expires_at, verified_badge, rating_average, rating_count, views, likes, saves, subscription_status, created_at, updated_at) VALUES
('biz-021', 'user-001', 'cat-restaurants', 'Dili Coffee House', 'dili-coffee-house', 'active', 'Joao Pereira', '+670 7721 1021', '+670', 2018, 'info@dilicoffee.tl', 'Rua de Mascarenhas, Dili', 'Specialty coffee roaster and cafe serving single-origin Timorese coffee beans. We support local farmers and offer brewing workshops.', 'Mon-Fri 7AM-9PM, Sat-Sun 8AM-10PM', 1735689600, 1, 4.8, 89, 1230, 156, 67, 'active', 1718000000, 1718000000),
('biz-022', 'user-002', 'cat-hotels', 'Beachfront Resort Dili', 'beachfront-resort-dili', 'active', 'Maria Santos', '+670 7721 1022', '+670', 2015, 'reservations@beachfront.tl', 'Avenida de Portugal, Dili', 'Luxury beachfront resort with ocean views, infinity pool, spa, and fine dining restaurant. Perfect for business travelers and tourists.', '24/7', 1735689600, 1, 4.7, 234, 3420, 412, 178, 'active', 1718000001, 1718000001),
('biz-023', 'user-003', 'cat-transport', 'TL Tour Adventures', 'tl-tour-adventures', 'active', 'Carlos Almeida', '+670 7721 1023', '+670', 2017, 'tours@tltour.tl', 'Rua Bispo Medeiros, Dili', 'Full-service tour operator offering city tours, mountain treks, diving expeditions, and cultural experiences across Timor-Leste.', 'Mon-Sun 7AM-8PM', 1735689600, 1, 4.9, 167, 2150, 287, 134, 'active', 1718000002, 1718000002),
('biz-024', 'user-001', 'cat-beauty', 'LUXE Beauty Salon', 'luxe-beauty-salon', 'active', 'Ana Da Costa', '+670 7721 1024', '+670', 2019, 'book@luxebeauty.tl', 'Rua de Beloi, Dili', 'Premium beauty salon offering hair styling, coloring, skincare treatments, manicure, pedicure, and bridal packages. English and Tetum speaking staff.', 'Tue-Sun 9AM-8PM', 1735689600, 1, 4.6, 78, 890, 102, 45, 'active', 1718000003, 1718000003),
('biz-025', 'user-002', 'cat-shops', 'TL Handicrafts Market', 'tl-handicrafts-market', 'active', 'Pedro Belo', '+670 7721 1025', '+670', 2010, 'sales@tlhandicrafts.tl', 'Tais Market, Dili', 'Authentic Timorese handicrafts including tais (traditional woven cloth), wood carvings, silver jewelry, and baskets. All items handmade by local artisans.', 'Mon-Sat 8AM-7PM, Sun 9AM-5PM', 1735689600, 1, 4.8, 145, 1680, 198, 89, 'active', 1718000004, 1718000004),
('biz-026', 'user-003', 'cat-services', 'ProFix Computer Services', 'profix-computer-services', 'active', 'Rui Fernandes', '+670 7721 1026', '+670', 2016, 'support@profix.tl', 'Rua de Quintal, Dili', 'Professional computer repair, IT support, network setup, and software installation services. Authorized service center for major brands.', 'Mon-Sat 9AM-6PM', 1735689600, 0, 4.5, 56, 720, 78, 34, 'active', 1718000005, 1718000005),
('biz-027', 'user-001', 'cat-health', 'TL Medical Clinic', 'tl-medical-clinic', 'active', 'Dr. Jose da Silva', '+670 7721 1027', '+670', 2014, 'info@tlmedical.tl', 'Rua de Hospital, Dili', 'Modern medical clinic offering general practice, dental, pediatric, and emergency care. English, Tetum, and Portuguese speaking doctors. Travel medicine certified.', 'Mon-Sat 8AM-8PM, Emergency 24/7', 1735689600, 1, 4.7, 198, 2890, 234, 112, 'active', 1718000006, 1718000006),
('biz-028', 'user-002', 'cat-construction', 'TL Building Solutions', 'tl-building-solutions', 'active', 'Manuel Soares', '+670 7721 1028', '+670', 2013, 'projects@tlbuild.tl', 'Rua de Caicoli, Dili', 'Full-service construction company specializing in residential and commercial buildings, renovations, and project management. Licensed and insured.', 'Mon-Fri 8AM-5PM, Sat 9AM-1PM', 1735689600, 1, 4.6, 67, 1120, 134, 56, 'active', 1718000007, 1718000007);

-- ============================================
-- ADDITIONAL NON-PROFITS (4 more)
-- ============================================
INSERT OR IGNORE INTO non_profits (id, owner_id, category_id, title, slug, status, contact_name, contact_number, country_code, year_of_establishment, email, address, about_us, views, likes, saves, subscription_status, created_at, updated_at) VALUES
('np-009', 'user-001', 'np-cat-environment', 'Eco Timor', 'eco-timor', 'active', 'Maria Guterres', '+670 7721 2009', '+670', 2015, 'info@ecotimor.tl', 'Rua de Lecidere, Dili', 'Environmental organization working on reforestation, marine conservation, and sustainable agriculture. Volunteer programs available.', 1450, 198, 67, 'active', 1718100000, 1718100000),
('np-010', 'user-002', 'np-cat-women', 'TL Women Network', 'tl-women-network', 'active', 'Lucia Lobato', '+670 7721 2010', '+670', 2012, 'info@tlwomen.tl', 'Rua de Colmera, Dili', 'Empowering women through education, microfinance, and leadership training. Programs for rural women, survivors of domestic violence, and youth.', 1890, 245, 89, 'active', 1718100001, 1718100001),
('np-011', 'user-003', 'np-cat-youth', 'Youth Action Timor', 'youth-action-timor', 'active', 'Joaquim da Costa', '+670 7721 2011', '+670', 2018, 'info@yat.tl', 'Bidau, Dili', 'Youth-led organization focused on leadership development, sports, arts, and entrepreneurship. After-school programs and summer camps.', 980, 156, 54, 'active', 1718100002, 1718100002),
('np-012', 'user-001', 'np-cat-culture', 'Arte Moris', 'arte-moris', 'active', 'Andrea Belo', '+670 7721 2012', '+670', 2005, 'info@artemoris.tl', 'Balide, Dili', 'Art school and cultural center promoting Timorese art, music, and traditional dance. Classes for children and adults, exhibitions, performances.', 2340, 312, 134, 'active', 1718100003, 1718100003);

-- ============================================
-- ADDITIONAL PUBLIC SECTORS (6 more)
-- ============================================
INSERT OR IGNORE INTO public_sectors (id, owner_id, category_id, title, slug, status, contact_name, contact_number, country_code, year_of_establishment, email, address, about_us, views, likes, saves, subscription_status, created_at, updated_at) VALUES
('ps-007', 'admin-001', 'ps-cat-ministries', 'Ministry of Tourism', 'ministry-of-tourism', 'active', 'Secretary Office', '+670 7721 3007', '+670', 2007, 'info@turismo.gov.tl', 'Edificio do Governo, Dili', 'Government ministry responsible for developing and promoting tourism in Timor-Leste. Tourism information, licensing, and policy.', 1890, 145, 67, 'active', 1718200000, 1718200000),
('ps-008', 'admin-002', 'ps-cat-justice', 'Court of Appeal', 'court-of-appeal', 'active', 'Registrar Office', '+670 7721 3008', '+670', 2002, 'info@tribunal.gov.tl', 'Dili, Timor-Leste', 'The Court of Appeal is the highest court in Timor-Leste. Reviews decisions from lower courts and handles constitutional matters.', 1230, 89, 34, 'active', 1718200001, 1718200001),
('ps-009', 'admin-003', 'ps-cat-justice', 'Prosecutor General', 'prosecutor-general', 'active', 'Public Information', '+670 7721 3009', '+670', 2002, 'info@pgr.tl', 'Rua de Caicoli, Dili', 'Office of the Prosecutor General of Timor-Leste. Prosecutes criminal cases and represents the state in legal proceedings.', 1450, 78, 28, 'active', 1718200002, 1718200002),
('ps-010', 'admin-001', 'ps-cat-health', 'Hospital Nacional Guido Valadares', 'hospital-nacional-guido-valadares', 'active', 'Reception', '+670 7721 3010', '+670', 2002, 'info@hngv.gov.tl', 'Bairro Pite, Dili', 'National referral hospital of Timor-Leste providing emergency, surgical, pediatric, obstetric, and specialist medical services.', 3450, 234, 123, 'active', 1718200003, 1718200003),
('ps-011', 'admin-002', 'ps-cat-utilities', 'EDTL Electricidade', 'edtl-electricidade', 'active', 'Customer Service', '+670 7721 3011', '+670', 2011, 'info@edtl.tl', 'Rua de Beloi, Dili', 'National electricity company of Timor-Leste. Power generation, distribution, and customer services across the country.', 2120, 167, 78, 'active', 1718200004, 1718200004),
('ps-012', 'admin-003', 'ps-cat-embassy', 'Embassy of Australia', 'embassy-of-australia', 'active', 'Consular Section', '+670 7721 3012', '+670', 2002, 'dili.embassy@dfat.gov.au', 'Avenida de Portugal, Dili', 'Australian Embassy in Dili providing consular services, visa information, and assistance to Australian citizens in Timor-Leste.', 2890, 198, 89, 'active', 1718200005, 1718200005);


-- ============================================
-- USERS (admin + test users) - from 0050_seed_users.sql
-- ============================================
INSERT OR IGNORE INTO user (id, email, name, role, emailVerified, phone, createdAt, updatedAt) VALUES
('admin-001', 'admin@timorup.com', 'Admin User', 'admin', 1, '+670 7700 0001', 1717000000, 1717000000),
('admin-002', 'admin2@timorup.com', 'Admin User 2', 'admin', 1, '+670 7700 0002', 1717000000, 1717000000),
('admin-003', 'admin3@timorup.com', 'Admin User 3', 'admin', 1, '+670 7700 0003', 1717000000, 1717000000),
('user-001', 'user1@timorup.com', 'John Smith', 'user', 1, '+670 7721 1001', 1717000000, 1717000000),
('user-002', 'user2@timorup.com', 'Maria Santos', 'user', 1, '+670 7722 2002', 1717000000, 1717000000),
('user-003', 'user3@timorup.com', 'Carlos Soares', 'user', 1, '+670 7723 3003', 1717000000, 1717000000),
('user-004', 'user4@timorup.com', 'Ana Fatima', 'user', 1, '+670 7724 4004', 1717000000, 1717000000),
('user-005', 'user5@timorup.com', 'Jose Silva', 'user', 1, '+670 7725 5005', 1717000000, 1717000000),
('user-006', 'user6@timorup.com', 'Lisa Monica', 'user', 1, '+670 7726 6006', 1717000000, 1717000000),
('user-007', 'user7@timorup.com', 'Pedro Costa', 'user', 1, '+670 7727 7007', 1717000000, 1717000000),
('user-008', 'user8@timorup.com', 'Rosa Lima', 'user', 1, '+670 7728 8008', 1717000000, 1717000000),
('user-009', 'user9@timorup.com', 'Manuel Cruz', 'user', 1, '+670 7729 9009', 1717000000, 1717000000),
('user-010', 'user10@timorup.com', 'Julia Pereira', 'user', 1, '+670 7720 1010', 1717000000, 1717000000),
('user-011', 'user11@timorup.com', 'Antonio Belo', 'user', 1, '+670 7721 2011', 1717000000, 1717000000),
('user-012', 'user12@timorup.com', 'Teresa Hornay', 'user', 1, '+670 7722 3012', 1717000000, 1717000000);
