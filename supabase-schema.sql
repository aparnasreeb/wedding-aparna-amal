-- This template is designed for the existing public.wedding_content table.
-- Do NOT delete your existing wedding_content table or row 1.
-- Your existing rsvps table should have invitation_id bigint referencing wedding_content(id).

-- If your project already has these, these commands are harmless.
alter table public.rsvps add column if not exists invitation_id bigint;

-- The foreign key may already exist; only run this if it does not.
-- alter table public.rsvps add constraint rsvps_invitation_id_fkey
-- foreign key (invitation_id) references public.wedding_content(id);

-- For the current Amal & Aparna invitation, existing RSVPs should use invitation_id = 1.
-- Do not run the UPDATE blindly if your data has already been assigned.
