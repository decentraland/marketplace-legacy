# Decentraland HTTP API

Base URL: `https://api.decentraland.org/v1`

---

## Table of Content

* [Contributions](#contributions)
* [Districts](#districts)
* [Estates](#estates)
* TODO: Mortgages
* [Map](#map)
* [Parcels](#parcels)
* [Publications](#publications)
* [Translations](#translations)

---

## Contributions

```
GET /addresses/:address/contributions
```

### Description

Returns all the contributions to districts for a given address

### URI Params

| name    | type   | description         |
| ------- | ------ | ------------------- |
| address | string | An Ethereum address |

### Response Example

```json
{
  "ok": true,
  "data": [
    {
      "address": "0x374cc898638940452b6d7b34f6063170976026f0",
      "district_id": "219ac351-e6ce-4e17-8b84-eb008afddf69",
      "land_count": "5"
    },
    {
      "address": "0x374cc898638940452b6d7b34f6063170976026f0",
      "district_id": "d9bfa18a-c856-457d-8d85-e2dc3b7648a1",
      "land_count": "15"
    },
    {
      "address": "0x374cc898638940452b6d7b34f6063170976026f0",
      "district_id": "f5d8e722-fdce-4d41-b38b-adfed2e0cf6c",
      "land_count": "10"
    }
  ]
}
```

---

```
GET /districts
```

Returns all the districts in Genesis City

### Response Example

```json
{
  "ok": true,
  "data": [
    {
      "id": "106f1557-4a92-41a4-9f18-40fcb90b4031",
      "name": "Dragon City",
      "description":
        "A perfect combination of China’s ancient culture and Western modernization, a reflection of both the Eastern and Western civilizations.",
      "link": "https://github.com/decentraland/districts/issues/30",
      "public": true,
      "parcel_count": "6485",
      "center": "105,-89"
    },
    {
      "id": "219ac351-e6ce-4e17-8b84-eb008afddf69",
      "name": "AETHERIAN project",
      "description":
        "Aetherian City will be one of the main attractions for visitors and dwellers of Decentraland, as it intends to be the largest cyberpunk-agglomeration of the metaverse.",
      "link": "https://github.com/decentraland/districts/issues/33",
      "public": true,
      "parcel_count": "10005",
      "center": "106,105"
    }
  ]
}
```

## Estates

```
GET /estates
```

### Description

Returns a list of Estates, paginated, sorted, and filtered according to the query params used.

| name       | type | default              | description                                                                          |
| ---------- | ---- | -------------------- | ------------------------------------------------------------------------------------ |
| status     | enum | `open`               | Filter parcels by publications status: `open`, `cancelled` or `sold`                 |
| sort_by    | enum | `created_at`         | Property to order by: `price`, `created_at`, `block_time_updated_at` or `expires_at` |
| sort_order | enum | depends on `sort_by` | The order to sort by: `asc` or `desc`                                                |
| limit      | int  | `20`                 | The number of results to be retuned                                                  |
| offset     | int  | `0`                  | The number of results to skip (used for pagination)                                  |

### Response Example

```json
//TODO: Add `Response Example`
```

---

```
GET /addresses/:address/estates
```

### Description

Returns all the Estates that belong to a given address

### URI Params

| name    | type   | description         |
| ------- | ------ | ------------------- |
| address | string | An Ethereum address |

## Map

```
GET /api/map.png
```

### Description

Returns a PNG of a section of the Genesis City map

### Query Params

| name         | type           | min       | max     | default | description                                                               |
| ------------ | -------------- | --------- | ------- | ------- | ------------------------------------------------------------------------- |
| width        | int            | 32        | 2048    | 500     | The width of the PNG image in pixels                                      |
| height       | int            | 32        | 2048    | 500     | The height of the PNG image in pixels                                     |
| size         | int            | 5         | 40      | 10      | The size of each parcel (i.e. 10 will render each parcel as 10x10 pixels) |
| center       | coords         | -150,-150 | 150,150 | 0,0     | The coords on where to center the map                                     |
| selected     | list of coords | N/A       | N/A     | N/A     | A list of coords separated by semicolons to render as "selected"          |
| publications | boolean        | N/A       | N/A     | false   | If true, parcels that are on sale are highlighted                         |

### Limits

There's a limit of 15,000 parcels that can be rendered in a single PNG, if a request goes above this threshold the API will return a 500 with a message like this:

```
Too many parcels. You are trying to render 42436 parcels and the maximum allowed is 15000.
```

### Request Example:

```
GET /api/map.png?width=500&height=500&size=10&center=20,21&selected=20,20;20,21;20,22;20,23;19,21;21,21
```

### Result:

![map-1](https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png)

---

```
GET /api/parcels/:x/:y/map.png
```

### Description

Returns a PNG of a piece of the map center on a given parcel

### URI Params

| name | type | min  | max | default | description               |
| ---- | ---- | ---- | --- | ------- | ------------------------- |
| x    | int  | -150 | 150 | 0       | The X coord of the parcel |
| y    | int  | -150 | 150 | 0       | The Y coord of the parcel |

### Query Params

| name         | type    | min | max  | default | description                                                               |
| ------------ | ------- | --- | ---- | ------- | ------------------------------------------------------------------------- |
| width        | int     | 32  | 2048 | 500     | The width of the PNG image in pixels                                      |
| height       | int     | 32  | 2048 | 500     | The height of the PNG image in pixels                                     |
| size         | int     | 5   | 40   | 10      | The size of each parcel (i.e. 10 will render each parcel as 10x10 pixels) |
| publications | boolean | N/A | N/A  | false   | If true, parcels that are on sale are highlighted                         |

### Limits

There's a limit of 15,000 parcels that can be rendered in a single PNG, if a request goes above this threshold the API will return a 500 with a message like this:

```
Too many parcels. You are trying to render 42436 parcels and the maximum allowed is 15000.
```

### Request Example:

```
GET /api/parcels/-36/-125/map.png?height=500&width=500&size=10&publications=true
```

### Result:

![map-1](https://user-images.githubusercontent.com/2781777/41127253-9f1af8a0-6a80-11e8-9b26-ba630c85871c.png)

---

## Parcels

```
GET /parcels
```

Returns a list of parcels, paginated, sorted, and filtered according to the query params used.

### Query Params

| name       | type | default              | description                                                                          |
| ---------- | ---- | -------------------- | ------------------------------------------------------------------------------------ |
| status     | enum | `open`               | Filter parcels by publications status: `open`, `cancelled` or `sold`                 |
| sort_by    | enum | `created_at`         | Property to order by: `price`, `created_at`, `block_time_updated_at` or `expires_at` |
| sort_order | enum | depends on `sort_by` | The order to sort by: `asc` or `desc`                                                |
| limit      | int  | `20`                 | The number of results to be retuned                                                  |
| offset     | int  | `0`                  | The number of results to skip (used for pagination)                                  |

### Response Example

```json
{
  "ok": true,
  "data": {
    "parcels": [
      {
        "id": "-74,-52",
        "x": -74,
        "y": -52,
        "auction_price": 2443,
        "district_id": null,
        "owner": "0xdeadbeeffaceb00c",
        "data": {
          "version": 0,
          "name": "My Parcel",
          "description": "My parcel is awesome",
          "ipns": ""
        },
        "auction_owner": "0xdeadbeeffaceb00c",
        "tags": {
          "proximity": {
            "plaza": {
              "district_id": "55327350-d9f0-4cae-b0f3-8745a0431099",
              "distance": 2
            },
            "road": {
              "district_id": "f77140f9-c7b4-4787-89c9-9fa0e219b079",
              "distance": 0
            }
          }
        },
        "last_transferred_at": null,
        "in_estate": false,
        "publication": {
          "tx_hash": "0xdeadbeeffaceb00c",
          "tx_status": "confirmed",
          "owner": "0xdeadbeeffaceb00c",
          "price": 60000,
          "status": "open",
          "buyer": null,
          "contract_id": "0xdeadbeeffaceb00c",
          "block_number": 5812730,
          "expires_at": 1533081600000,
          "block_time_created_at": 1529352925000,
          "block_time_updated_at": null,
          "type": "parcel",
          "asset_id": "-74,-52",
          "marketplace_id": "0xdeadbeeffaceb00c"
        }
      }
    ],
    "total": 2
  }
}
```

---

```
GET /addresses/:address/parcels
```

### Description

Returns all the parcels that belong to a given address

## Publications

```
GET /parcels/:x/:y/publications
```

### Description

Returns all the publications that ever existed for a given parcel

### URI Params

| name | type | min  | max | default | description               |
| ---- | ---- | ---- | --- | ------- | ------------------------- |
| x    | int  | -150 | 150 | 0       | The X coord of the parcel |
| y    | int  | -150 | 150 | 0       | The Y coord of the parcel |

---

```
GET /publications/:txHash
```

### Description

Returns a specific publication by its transaction hash

### URI Params

| name   | type   | description                           |
| ------ | ------ | ------------------------------------- |
| txHash | string | The transaction hash of a publication |

---

## Translations

```
GET /translations/:locale
```

### Description

Returns all the available translations for a given `locale`

### URI Params

| name   | type | description                                                  |
| ------ | ---- | ------------------------------------------------------------ |
| locale | enum | One of the following locales: `en`, `es`, `fr`, `ko` or `zh` |
