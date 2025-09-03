-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    openid VARCHAR NOT NULL UNIQUE,
    unionid VARCHAR UNIQUE,
    nickname VARCHAR,
    avatar_url VARCHAR,
    phone VARCHAR,
    gender INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_id UUID REFERENCES categories(id),
    image VARCHAR,
    sort_order INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建商品表
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spu_id VARCHAR NOT NULL UNIQUE,
    title VARCHAR NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    primary_image VARCHAR,
    images JSONB DEFAULT '[]',
    status INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建商品SKU表
CREATE TABLE IF NOT EXISTS product_skus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku_id VARCHAR NOT NULL UNIQUE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    origin_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    spec_info JSONB DEFAULT '[]',
    status INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建购物车表
CREATE TABLE IF NOT EXISTS carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES product_skus(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建收货地址表
CREATE TABLE IF NOT EXISTS addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    province VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    district VARCHAR NOT NULL,
    detail VARCHAR NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_no VARCHAR NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id),
    status INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    actual_amount DECIMAL(10,2) NOT NULL,
    address_info JSONB NOT NULL,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建订单明细表
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES product_skus(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    spec_info JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建优惠券表
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    type INTEGER NOT NULL DEFAULT 1,
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_count INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    status INTEGER DEFAULT 1,
    used_at TIMESTAMPTZ,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建轮播图表
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    image VARCHAR NOT NULL,
    link_type VARCHAR NOT NULL DEFAULT 'url',
    link_value VARCHAR,
    sort_order INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入初始分类数据
INSERT INTO categories (id, name, sort_order, status) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '服装', 1, 1),
('550e8400-e29b-41d4-a716-446655440002', '数码', 2, 1),
('550e8400-e29b-41d4-a716-446655440003', '家居', 3, 1),
('550e8400-e29b-41d4-a716-446655440004', '美妆', 4, 1)
ON CONFLICT (id) DO NOTHING;

-- 插入示例商品数据
INSERT INTO products (id, spu_id, title, description, category_id, primary_image, images, sort_order, status) VALUES 
('550e8400-e29b-41d4-a716-446655440101', 'SPU001', '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙', '时尚优雅的连衣裙，采用优质面料制作', '550e8400-e29b-41d4-a716-446655440001', 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png', '["https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png","https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09b.png"]', 1, 1),
('550e8400-e29b-41d4-a716-446655440102', 'SPU002', '腾讯极光盒子4智能网络电视机顶盒', '高清4K网络机顶盒，支持HDR', '550e8400-e29b-41d4-a716-446655440002', 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png', '["https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png"]', 2, 1),
('550e8400-e29b-41d4-a716-446655440103', 'SPU003', '蓝牙无线耳机降噪运动耳机', '高品质蓝牙耳机，支持主动降噪', '550e8400-e29b-41d4-a716-446655440002', 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-1a.png', '["https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-1a.png"]', 3, 1)
ON CONFLICT (id) DO NOTHING;

-- 插入商品SKU数据
INSERT INTO product_skus (id, sku_id, product_id, price, origin_price, stock_quantity, spec_info) VALUES 
('550e8400-e29b-41d4-a716-446655440201', 'SKU001001', '550e8400-e29b-41d4-a716-446655440101', 298.00, 400.00, 100, '[{"specTitle":"颜色","specValue":"米色荷叶边"},{"specTitle":"尺码","specValue":"S"}]'),
('550e8400-e29b-41d4-a716-446655440202', 'SKU001002', '550e8400-e29b-41d4-a716-446655440101', 298.00, 400.00, 150, '[{"specTitle":"颜色","specValue":"米色荷叶边"},{"specTitle":"尺码","specValue":"M"}]'),
('550e8400-e29b-41d4-a716-446655440203', 'SKU002001', '550e8400-e29b-41d4-a716-446655440102', 99.00, 169.00, 50, '[{"specTitle":"颜色","specValue":"经典白"},{"specTitle":"类型","specValue":"经典套装"}]'),
('550e8400-e29b-41d4-a716-446655440204', 'SKU003001', '550e8400-e29b-41d4-a716-446655440103', 199.00, 299.00, 80, '[{"specTitle":"颜色","specValue":"黑色"},{"specTitle":"版本","specValue":"标准版"}]')
ON CONFLICT (id) DO NOTHING;

-- 插入轮播图数据
INSERT INTO banners (id, title, image, link_type, link_value, sort_order, status) VALUES 
('550e8400-e29b-41d4-a716-446655440301', '春节大促销', 'https://tdesign.gtimg.com/miniprogram/template/retail/banner1.png', 'product', '550e8400-e29b-41d4-a716-446655440101', 1, 1),
('550e8400-e29b-41d4-a716-446655440302', '新品上市', 'https://tdesign.gtimg.com/miniprogram/template/retail/banner2.png', 'category', '550e8400-e29b-41d4-a716-446655440002', 2, 1)
ON CONFLICT (id) DO NOTHING;

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有需要的表创建更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_skus_updated_at BEFORE UPDATE ON product_skus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();