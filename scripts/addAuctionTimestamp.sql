UPDATE parcels SET auction_timestamp = 1517356800000 where auction_owner IS NOT NULL AND auction_price IS NOT NULL;
