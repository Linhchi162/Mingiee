const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseAnonKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/)[1].trim().replace(/['"]/g, '');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const testValue = "1 nhân vật có thiết kế đơn giản\nBackground đơn giản (màu, gradient, hiệu ứng nhẹ)\nCanvas 3000 pixels trở lên, 400DPI\nCanvas dọc / vuông (1:1, 3:4, 4:5)";
  
  const response = await supabase
    .from('site_content')
    .update({ value: testValue })
    .eq('key', 'commission_scope_items')
    .select();
  
  console.log('Update response:', JSON.stringify(response, null, 2));
}

run();
