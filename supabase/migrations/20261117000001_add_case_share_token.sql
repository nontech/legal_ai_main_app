-- Null means the case is not shared. The app sets a token for the owner.
-- Multiple nulls are allowed; a non-null token is unique.
alter table public.cases add column if not exists share_token uuid unique;
