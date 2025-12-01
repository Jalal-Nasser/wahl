import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ouqxknxqjwrmzxfovilq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cXhrbnhxandybXp4Zm92aWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTA4NjEsImV4cCI6MjA4MDA2Njg2MX0.mSHPiE43n2gcRu5LLSVNo428yWOKVqHeK5kOxeaPiz8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)