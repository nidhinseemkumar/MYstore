process.loadEnvFile('./.env');

async function run() {
    const res = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/categories?select=name,image_url`, {
        method: 'GET',
        headers: {
            'apikey': process.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
        }
    });
    
    const data = await res.json();
    console.log("Database URLs:");
    data.forEach(d => console.log(`${d.name} -> ${d.image_url}`));
}

run();
