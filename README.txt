AMAL & APARNA — REUSABLE MULTI-INVITATION WEBSITE TEMPLATE

This version is aligned with the existing Supabase table public.wedding_content.
It preserves the existing invitation row and uses its numeric id for the guest site and RSVPs.

FILES
-----
index.html              Guest invitation
admin.html              Reusable Admin editor + invitation manager
script.js               Guest-site logic
style.css               Design
config.js               Supabase settings + numeric invitation ID
supabase-schema.sql     Reference SQL for the existing schema

CURRENT DATABASE SETUP
----------------------
Your existing table is: public.wedding_content
The current Amal & Aparna invitation is row id = 1.
Your rsvps table has invitation_id bigint and points to wedding_content(id).

DO NOT delete wedding_content row 1.
DO NOT delete the existing RSVP records.

CREATE ANOTHER INVITATION
-------------------------
1. Open admin.html and log in.
2. Click “+ Create new invitation”.
3. Enter the couple/invitation name.
4. The Admin creates a new row in wedding_content and gives it a numeric ID.
5. Edit and save the new invitation.
6. Use the “Copy link” button for that invitation. The link uses the same GitHub Pages site with a different ?id= value.
7. Guests opening that link see only that invitation.
8. Keep the same Supabase project for all invitations.

RSVPs
-----
Guest RSVPs are saved with the numeric invitation_id, so RSVPs can be separated by invitation.

PHOTOS
------
The Admin has: Hero Photo, Invitation Background Photo, Celebrations Photo, RSVP Photo, Closing Photo.
There is no “Between invitation & celebrations” photo.

SECURITY
--------
The browser uses the Supabase publishable key. Never put a service-role/secret key in these files.
Keep RLS enabled on your tables.
