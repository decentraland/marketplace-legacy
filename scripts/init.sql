-- Renames
ALTER TABLE projects RENAME "createdAt" TO created_at;
ALTER TABLE projects RENAME "updatedAt" TO updated_at;
ALTER TABLE projects RENAME parcels TO parcel_count;
ALTER TABLE projects RENAME lookup TO center;
ALTER TABLE projects RENAME "desc" TO description;

ALTER TABLE parcel_states RENAME TO parcels;
ALTER TABLE parcels RENAME amount TO price;
ALTER TABLE parcels DROP address;
ALTER TABLE parcels DROP "endsAt";
ALTER TABLE parcels DROP "bidIndex";
ALTER TABLE parcels DROP "bidGroupId";
ALTER TABLE parcels RENAME "projectId" TO project_id;
ALTER TABLE parcels RENAME "createdAt" TO created_at;
ALTER TABLE parcels RENAME "updatedAt" TO updated_at;
ALTER INDEX parcel_states_pkey RENAME TO parcels_pkey;
ALTER INDEX parcel_states_amount_idx RENAME TO parcels_price_idx;
ALTER INDEX parcel_states_x_y_idx RENAME TO parcels_x_y_idx;

-- Add parcel info to projects
ALTER TABLE projects ADD parcel_ids TEXT[] DEFAULT NULL;
UPDATE projects PJ SET parcel_ids = (SELECT ARRAY_AGG(P.id) FROM parcels P WHERE P.project_id = PJ.id);
