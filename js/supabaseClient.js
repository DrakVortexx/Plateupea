// Supabase Client
const { createClient } = supabase;

let supabase = null;

function initSupabase() {
    const supabaseUrl = localStorage.getItem('supabase_url') || CONFIG.SUPABASE_URL;
    const supabaseKey = localStorage.getItem('supabase_key') || CONFIG.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase credentials not configured');
        return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
}

function getSupabase() {
    return supabase;
}
