import { supabase } from './client';

/**
 * Direct Supabase database operations
 * Use these when backend API is unavailable
 */

// Auth operations
export const supabaseAuth = {
  signUp: async (email: string, password: string, metadata: { name: string; role: string; phone?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};

// Collector operations
export const supabaseCollectors = {
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('collectors')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  getByCardNumber: async (cardNumber: string) => {
    const { data, error } = await supabase
      .from('collectors')
      .select('*')
      .eq('card_number', cardNumber)
      .single();
    
    if (error) throw error;
    return data;
  },

  getByPhone: async (phone: string) => {
    const { data, error } = await supabase
      .from('collectors')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (collectorData: {
    user_id?: string;
    card_number: string;
    full_name: string;
    phone: string;
    neighborhood: string;
    preferred_language?: string;
    can_read?: string;
    primary_hub_id?: string;
  }) => {
    const { data, error } = await supabase
      .from('collectors')
      .insert(collectorData as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('collectors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Collections (transactions) operations
export const supabaseCollections = {
  create: async (collectionData: {
    collector_id: string;
    hub_id: string;
    plastic_type: string;
    weight_kg: number;
    price_per_kg: number;
    total_value: number;
    instant_cash?: number;
    savings_token?: number;
    quality?: string;
    collection_location?: any;
  }) => {
    const { data, error } = await supabase
      .from('collections')
      .insert(collectionData as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getByCollectorId: async (collectorId: string) => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('collector_id', collectorId)
      .order('collected_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getPending: async (hubId?: string) => {
    let query = supabase
      .from('collections')
      .select('*, collectors(*)')
      .eq('status', 'pending');
    
    if (hubId) {
      query = query.eq('hub_id', hubId);
    }
    
    const { data, error } = await query.order('collected_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  updateStatus: async (collectionId: string, status: string, verifiedBy?: string) => {
    const updateData: any = { status };
    if (verifiedBy) {
      updateData.verified_by = verifiedBy;
      updateData.verified_at = new Date().toISOString();
    }
    
    const { data, error } = await (supabase
      .from('collections') as any)
      .update(updateData)
      .eq('id', collectionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Hubs operations
export const supabaseHubs = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('hubs')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  getById: async (hubId: string) => {
    const { data, error } = await supabase
      .from('hubs')
      .select('*')
      .eq('id', hubId)
      .single();
    
    if (error) throw error;
    return data;
  },

  getByManagerId: async (managerId: string) => {
    const { data, error } = await supabase
      .from('hubs')
      .select('*')
      .eq('manager_id', managerId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Health data operations
export const supabaseHealth = {
  getByRegion: async (region: string) => {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('region', region)
      .order('data_date', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  getLatest: async () => {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .order('data_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Messages operations
export const supabaseMessages = {
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(name, email)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  send: async (messageData: {
    sender_id: string;
    receiver_id: string;
    subject?: string;
    content: string;
    message_type?: string;
  }) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  markAsRead: async (messageId: string) => {
    const { data, error } = await (supabase
      .from('messages') as any)
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Dashboard stats
export const supabaseDashboard = {
  getCollectorStats: async (collectorId: string) => {
    // Get total collections
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .select('weight_kg, total_value')
      .eq('collector_id', collectorId)
      .eq('status', 'verified');

    if (collectionsError) throw collectionsError;

    const totalWeight = collections?.reduce((sum: number, c: any) => sum + parseFloat(c.weight_kg), 0) || 0;
    const totalEarnings = collections?.reduce((sum: number, c: any) => sum + parseFloat(c.total_value), 0) || 0;

    return {
      totalCollections: collections?.length || 0,
      totalWeight,
      totalEarnings,
      recentCollections: collections?.slice(0, 5) || []
    };
  },

  getHubStats: async (hubId: string) => {
    // Get hub collectors count
    const { count: collectorsCount } = await supabase
      .from('collectors')
      .select('*', { count: 'exact', head: true })
      .eq('primary_hub_id', hubId)
      .eq('status', 'active');

    // Get pending collections
    const { data: pending } = await supabase
      .from('collections')
      .select('*')
      .eq('hub_id', hubId)
      .eq('status', 'pending');

    // Get today's collections
    const today = new Date().toISOString().split('T')[0];
    const { data: todayCollections } = await supabase
      .from('collections')
      .select('weight_kg, total_value')
      .eq('hub_id', hubId)
      .gte('collected_at', today);

    const todayWeight = todayCollections?.reduce((sum: number, c: any) => sum + parseFloat(c.weight_kg), 0) || 0;
    const todayValue = todayCollections?.reduce((sum: number, c: any) => sum + parseFloat(c.total_value), 0) || 0;

    return {
      activeCollectors: collectorsCount || 0,
      pendingCollections: pending?.length || 0,
      todayWeight,
      todayValue,
      pendingItems: pending || []
    };
  }
};
