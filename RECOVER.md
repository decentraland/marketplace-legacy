# Marketplace Troubleshooting

## Database out of sync

The Marketplace app relies on storing events from the Blockchain that we use as a cache. This not only enables faster querying, but also lets us provide an API used by multiple third party services, and gives us easy reporting.

For that purpose we created a process that we call **"The Monitor"** to listen, store and process relevant events from the contracts we are interested in.

There are certain conditions where the database can reach a state where the information stored is different from the Blockchain data.

These causes might be due, but not limited, to the following reasons:

* Ethereum nodes missing to report certain Events.
* Ethereum nodes losing peers and lagging behind.
* Reorgs that were not handled correctly.
* Problems in the infrastructure that make the monitor process to disconnect from the nodes.
* Any bug in any part of the architecture.

### Solution

As of today there are two approaches to solve data sync problems.

#### Sanity check

The sanity check is a script that performs a number of **Diagnosis** about different conditions that might happen with the data (Parcels, Estates, Publications), it compares relevant contracs to the database, identifies differences and uses a number of **Doctors** to fix problems.

Example runs of the sanity check:

* Run in dry-run mode (read only - it will not perform any change):

`npm run sanity-check`

* Run in self-heal mode will try to fix problems:

`npm run sanity-check -- --self-heal`

* Run in self-heal mode but avoid Parcel and Publication checks:

`run sanity-check -- --skip=Parcel,Publication --self-heal`

Current options for --skip are `Parcel`, `Publication` and `Estate` as comma-separated values.

#### Full database refresh

A second more drastic approach is to fully refresh the database data from scratch deleting it's current state and re-fetching and processing all events from the Blockchain.

The recommended procedure to perform a full refresh is the following:

1.  Stop the monitor process:

`sudo supervisorctl stop monitor`

2.  Reset the current db data:

`npm run cli delete-monitor-data`

3.  Start the monitor process. As there is no data the latest block will be 0 and will process events from start:

`sudo supervisorctl start monitor`

4.  Follow progress of monitor using:

`tail -f /var/log/monitor.out.log`

### Additional recommendations

When performing maintenance work it's suggested to disable the frontend by using a placeholder landing page for users to know that the site is not operational.

Execute the following steps from the app directory:

1.  `cd ./scripts/maintenance`

2.  `./switch.sh down <s3-bucket> <cf-distribution-id>`

3.  Perform maintenance operations...

4.  `./switch.sh up <s3-bucket> <cf-distribution-id>`

Note: You need proper permissions to the required AWS resources.
