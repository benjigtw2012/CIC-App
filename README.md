
# CIC App Multi User

Multi-user version with:
- Supabase login
- shared quote database
- conflict-free quote numbers
- saved quotes
- saved purchase orders
- Dropbox backup endpoint

## Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase_schema.sql`.
3. Create two users in Supabase Authentication.
4. Upload this whole folder to GitHub.
5. Import repo into Vercel.
6. Add Vercel environment variables:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
DROPBOX_ACCESS_TOKEN

Dropbox token is optional. Without it, quotes/orders still save to Supabase.


## Product database

This build includes 204 product lines from the fuller CIC app product database.
