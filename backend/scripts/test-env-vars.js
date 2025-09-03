console.log('🔍 检查环境变量...')

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已设置' : '❌ 未设置')

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('Anon Key (前10字符):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...')
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Service Key (前10字符):', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...')
}
