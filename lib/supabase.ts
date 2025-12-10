import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< HEAD
import { createClient, processLock } from '@supabase/supabase-js';
=======
import { createClient } from '@supabase/supabase-js';
>>>>>>> temp_feature
import { Database } from '../types';

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
<<<<<<< HEAD
      lock: processLock,
=======
>>>>>>> temp_feature
    },
  },
);
