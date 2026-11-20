# Riverwatch Sample Review

Build a browser-local workspace used by a river monitoring team at their morning handoff. An operator must make a disposition for water samples while preserving links between stations, repeat samples and lab notes. This is a records management prototype. The fixture values are synthetic and the app should never recommend health or treatment decisions.

| ID / collected | Station | Turbidity / conductivity | Assessment and lab context |
| --- | --- | --- | --- |
| RW-201 / Jun 3 07:42 | Mill Weir | 16.8 NTU / 294 µS/cm | Review, storm runoff. Repeat RW-205. Lab L-18 logged intact seal. |
| RW-202 / Jun 3 07:55 | Market Bridge | 7.2 NTU / 318 µS/cm | Accepted. Lab L-19 logged clear duplicate. |
| RW-203 / Jun 3 08:10 | North Ferry | 2.6 NTU / 410 µS/cm | Review, bottle-label mismatch. Repeat RW-206. Lab L-20 requests chain-of-custody check. |
| RW-204 / Jun 3 08:22 | Birch Cut | 3.2 NTU / 360 µS/cm | Accepted. Lab L-21 logged intact seal. |
| RW-205 / Jun 4 07:40 | Mill Weir | 5.1 NTU / 298 µS/cm | Review, repeat for RW-201. Lab L-22 says runoff receded overnight. |
| RW-206 / Jun 4 08:12 | North Ferry | 2.5 NTU / 408 µS/cm | Hold, repeat for RW-203. Lab L-23 says second bottle identifier verified. |
| RW-207 / Jun 4 08:50 | Birch Cut | 4.1 NTU / 365 µS/cm | Review, field meter recalibrated. Lab L-24 reports fresh check standard. |
| RW-208 / Jun 4 09:10 | Market Bridge | 6.9 NTU / 321 µS/cm | Review. Lab L-25 reports late transport and intact seal. |

Operators can search by ID or lab note, filter by station and disposition, open an exact sample, navigate from the detail to its linked repeat and get back, and compare any two samples with units, timestamps, dispositions and lab notes intact. They can set Accept, Hold or Review from detail, supply a required note for Hold, see the change throughout the app, and undo a disposition without affecting other records. Filters can exclude the newly changed record. Make that change understandable and support continuing to another record without losing the work context or comparison. Preserve records, disposition notes, selection and meaningful work context across reload. Leave a way to recover if no records match. No credentials or backend are required.
