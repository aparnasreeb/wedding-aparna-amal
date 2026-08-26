VERSION 3

1. Run supabase_schema.sql in Supabase SQL Editor.
2. Create an admin user in Supabase Authentication > Users.
3. Upload these files to the GitHub Pages repository.
4. Open /admin.html and log in.
5. Enter the wedding WhatsApp number in the editor and save.

The public site reads content from Supabase. RSVPs are saved to Supabase and then WhatsApp opens with a pre-filled RSVP message. The guest still presses Send.

Never put a secret/service-role key in browser code. The included key is the client publishable key supplied for this project.
