// ============================================
// SUPABASE CONFIGURATION - GetsyBuy Gift
// ============================================

const SUPABASE_URL = "https://hohkmownflleevxeodwb.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaGttb3duZmxsZWV2eGVvZHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTUyMzEsImV4cCI6MjA4ODgzMTIzMX0.V5dfPc_eGkEm_G3Q3hPzNeVSgzGQ9G8cNAe1Is9vWTI";

// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ============================================
// PRODUCTS API
// ============================================

const ProductsAPI = {

  // Get all products
  async getAll() {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  },


  // Add product
  async add(product) {
    const { data, error } = await supabaseClient
      .from("products")
      .insert([product])
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    return data[0];
  },


  // Update product
  async update(id, updates) {
    const { data, error } = await supabaseClient
      .from("products")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    return data[0];
  },


  // Delete product
  async delete(id) {
    const { error } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      throw error;
    }

    return true;
  }
};