-- Drops
DROP TABLE districts;
DROP TABLE parcels;
DROP TABLE parcel_states;
DROP TABLE projects;

-- Renames
ALTER TABLE projects RENAME TO districts;
ALTER TABLE districts RENAME "createdAt" TO created_at;
ALTER TABLE districts RENAME "updatedAt" TO updated_at;
ALTER TABLE districts RENAME parcels TO parcel_count;
ALTER TABLE districts RENAME lookup TO center;
ALTER TABLE districts RENAME "desc" TO description;

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

-- Add parcel info to districts
ALTER TABLE districts ADD parcel_ids TEXT[] DEFAULT NULL;
UPDATE districts PJ SET parcel_ids = (SELECT ARRAY_AGG(P.id) FROM parcels P WHERE P.district_id = PJ.id);
