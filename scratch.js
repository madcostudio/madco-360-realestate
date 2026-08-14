const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
let supabaseUrl = '';
let serviceRoleKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceRoleKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const { data, error } = await supabase
    .from('site_content')
    .update({ value: { enabled: true, text: '⚡️ 100% Verified 360° Spatial Walkthroughs — Experience Luxury Homes Across India' } })
    .eq('key', 'announcement_banner');
    
  if (error) console.error('Error:', error);
  else console.log('Successfully updated announcement banner!');
}

run();
