/**
 * Database initialization script.
 * Creates all tables and seeds initial data (admin user + artworks).
 * 
 * Usage: node init-db.js
 */
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function initDB() {
    const client = await pool.connect();
    try {
        console.log('🔄 Creating tables...');

        // Create tables
        await client.query(`
            -- Users table
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW()
            );

            -- Artworks table
            CREATE TABLE IF NOT EXISTS artworks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10,2) NOT NULL,
                image_url TEXT NOT NULL,
                category VARCHAR(50) DEFAULT 'painting',
                created_at TIMESTAMP DEFAULT NOW()
            );

            -- Orders table
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                total_amount NUMERIC(10,2) NOT NULL,
                status VARCHAR(30) DEFAULT 'Pending',
                shipping_name VARCHAR(200),
                shipping_address TEXT,
                shipping_city VARCHAR(100),
                shipping_postal_code VARCHAR(20),
                shipping_phone VARCHAR(30),
                created_at TIMESTAMP DEFAULT NOW()
            );

            -- Order items table
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                artwork_id INTEGER REFERENCES artworks(id) ON DELETE SET NULL,
                title VARCHAR(255) NOT NULL,
                price NUMERIC(10,2) NOT NULL,
                image_url TEXT,
                quantity INTEGER DEFAULT 1
            );
        `);
        console.log('✅ Tables created successfully.');

        // Seed admin user (only if not exists)
        const adminCheck = await client.query(`SELECT id FROM users WHERE email = $1`, ['admin@artcocktail.com']);
        if (adminCheck.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await client.query(
                `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
                ['Admin', 'admin@artcocktail.com', hashedPassword, 'admin']
            );
            console.log('✅ Admin user created (admin@artcocktail.com / admin123)');
        } else {
            console.log('ℹ️  Admin user already exists.');
        }

        // Seed artworks (only if table is empty)
        const artworkCheck = await client.query(`SELECT COUNT(*) FROM artworks`);
        if (parseInt(artworkCheck.rows[0].count) === 0) {
            const artworks = [
                {
                    title: 'Golden Horizon',
                    description: 'A breathtaking abstract painting capturing the warmth of a golden sunset over an endless horizon. Rich textures and bold strokes create a mesmerizing depth.',
                    price: 12500,
                    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop',
                    category: 'abstract'
                },
                {
                    title: 'Ocean Resin Dreams',
                    description: 'A stunning resin artwork mimicking the deep blues and turquoise swirls of ocean waves. Each layer reveals hidden depths and shimmering gold veins.',
                    price: 18000,
                    image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop',
                    category: 'resin'
                },
                {
                    title: 'Crimson Elegance',
                    description: 'Bold red and black strokes dance across the canvas in this powerful abstract expression. A statement piece that commands attention in any room.',
                    price: 9500,
                    image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=800&fit=crop',
                    category: 'painting'
                },
                {
                    title: 'Midnight Garden',
                    description: 'Delicate flowers emerge from a dark background, painted with luminous colors that seem to glow. A perfect blend of realism and fantasy.',
                    price: 15000,
                    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop',
                    category: 'painting'
                },
                {
                    title: 'Cosmic Nebula',
                    description: 'Inspired by deep space photography, this resin masterpiece captures the swirling colors of a distant nebula. Embedded with metallic pigments that catch light.',
                    price: 22000,
                    image_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600&h=800&fit=crop',
                    category: 'resin'
                },
                {
                    title: 'Urban Fragments',
                    description: 'A modern abstract piece deconstructing city landscapes into geometric fragments. Cool grays meet warm gold accents in perfect harmony.',
                    price: 11000,
                    image_url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&h=800&fit=crop',
                    category: 'modern'
                },
                {
                    title: 'Serene Landscape',
                    description: 'Rolling hills bathed in soft morning light. This landscape painting brings the tranquility of nature into your living space with its calming palette.',
                    price: 13500,
                    image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=800&fit=crop',
                    category: 'landscape'
                },
                {
                    title: 'Abstract Portrait',
                    description: 'A striking portrait rendered in an abstract expressionist style. Bold colors and fluid lines capture the essence of emotion and identity.',
                    price: 16500,
                    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=800&fit=crop',
                    category: 'portrait'
                }
            ];

            for (const art of artworks) {
                await client.query(
                    `INSERT INTO artworks (title, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5)`,
                    [art.title, art.description, art.price, art.image_url, art.category]
                );
            }
            console.log(`✅ Seeded ${artworks.length} artworks.`);
        } else {
            console.log('ℹ️  Artworks already exist, skipping seed.');
        }

        console.log('\n🎉 Database initialization complete!');
    } catch (err) {
        console.error('❌ Error initializing database:', err.message);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

initDB().catch(() => process.exit(1));
