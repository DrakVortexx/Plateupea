// Supabase Client
let supabaseClientInstance = null;

function initSupabase() {
    try {
        const supabaseUrl = localStorage.getItem('supabase_url') || CONFIG.SUPABASE_URL;
        const supabaseKey = localStorage.getItem('supabase_key') || CONFIG.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials not configured');
            return null;
        }

        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabaseClientInstance = window.supabase.createClient(supabaseUrl, supabaseKey);
            return supabaseClientInstance;
        }
    } catch (e) {
        console.error('Supabase init error:', e);
    }
    return null;
}

function getSupabase() {
    return supabaseClientInstance;
}
