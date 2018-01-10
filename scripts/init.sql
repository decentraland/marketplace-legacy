-- Renames
ALTER TABLE projects RENAME TO districts;
ALTER TABLE districts RENAME "createdAt" TO created_at;
ALTER TABLE districts RENAME "updatedAt" TO updated_at;
ALTER TABLE districts RENAME parcels TO parcel_count;
ALTER TABLE districts RENAME lookup TO center;
ALTER TABLE districts RENAME "desc" TO description;
ALTER INDEX projects_pkey RENAME TO districts_pkey;

ALTER TABLE parcel_states RENAME TO parcels;
ALTER TABLE parcels RENAME amount TO price;
ALTER TABLE parcels DROP address;
ALTER TABLE parcels DROP "endsAt";
ALTER TABLE parcels DROP "bidIndex";
ALTER TABLE parcels DROP "bidGroupId";
ALTER TABLE parcels RENAME "projectId" TO district_id;
ALTER TABLE parcels RENAME "createdAt" TO created_at;
ALTER TABLE parcels RENAME "updatedAt" TO updated_at;
ALTER INDEX parcel_states_pkey RENAME TO parcels_pkey;
ALTER INDEX parcel_states_amount_idx RENAME TO parcels_price_idx;
ALTER INDEX parcel_states_x_y_idx RENAME TO parcels_x_y_idx;

ALTER TABLE district_entries RENAME TO contributions;
ALTER TABLE contributions RENAME "createdAt" TO created_at;
ALTER TABLE contributions RENAME "updatedAt" TO updated_at;
ALTER TABLE contributions RENAME project_id TO district_id;
ALTER TABLE contributions RENAME lands TO land_count;
ALTER TABLE contributions RENAME "userTimestamp" TO timestamp;
ALTER TABLE contributions DROP "action";
ALTER INDEX district_entries_pkey RENAME TO contributions_pkey;
ALTER INDEX district_entries_address_idx RENAME TO contributions_address_idx;

-- Add parcel info to districts
ALTER TABLE districts ADD parcel_ids TEXT[] DEFAULT NULL;
UPDATE districts PJ SET parcel_ids = (SELECT ARRAY_AGG(P.id) FROM parcels P WHERE P.district_id = PJ.id);
