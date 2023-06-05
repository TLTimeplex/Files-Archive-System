### --- v0.3.8 --- 05.06.23, 12.42 UTC+2 ---
* API: Added: Archived Reports can now be "unachived"
* API: Added: Middleware check for archived reports if they exist

### --- v0.3.7 --- 05.06.23, 12.34 UTC+2 ---
* API: Added: Reports can now be archived

### --- v0.3.6 --- 01.06.23, 16.48 UTC+2 ---
* API: Added: New interface for Archive[d reports]
* API: Changed: DB autoInit is now also async and will no longer throw an error on first start

### --- v0.3.5 --- 01.06.23, 16.15 UTC+2 ---
* API: Added: API checks now if the version of the DB is older than the current version and "updates" it if necessary (only creating missing tables not altering existing ones)
* API: Added: New table for archived reports (Copy of reports)
* API: Changed: Create Schema is now awaitable
* API: Changed: Drop Schema is now awaitable
* API: Fix: Fixed the version class which outputted 0s as undefined

### --- v0.3.4 --- 01.06.23, 15.40 UTC+2 ---
* API: Changed: Ordered endware in separat folders 

### --- v0.3.3 --- 01.06.23, 12.55 UTC+2 ---
* CLIENT: Fix: Preview gets now only once drawn on fist load instead of twice
* API: Changed: Deleting a file now doesn't check anymore if the file should exist, instead it checks if the file somehow exists and deletes it

### --- v0.3.2 --- 01.06.23, 12.30 UTC+2 ---
* CLIENT: Fix: The preview of Files should now update correctly without displaying ghost files

### --- v0.3.1 --- 31.05.23, 14.15 UTC+2 ---
* API: Added: Messing implementation of GET for the list of imageIDs of a report
* CLIENT: Changed: Editor has now some space between the buttons and the window bottom
* CLIENT: Added: Client now downloads files from the server, when the user syncs with the server
* CLIENT: Added: New IDB function to look up if a file exists in the IDB
* CLIENT: Changed: AddCard can now also just display custom text

### --- v0.3.0 --- 30.05.23, 11.20 UTC+2 ---
* API: Added: New Type FileMeta for files to store name, type and size
* API: Added: New GET route for file meta data
* API: Changed: API now scarps the file meta for an extra saved file
* API: Changed: API also deletes the meta of a file when deleting the file
* CLIENT: Added: Client now requests file from the server, when the file is not in the storage and the report is uploaded

### --- v0.2.2 --- 29.05.23, 13.58 UTC+2 ---
* API: Changed: Changed the get Report IDs with filter method from GET to POST to support the filter mask.
* CLIENT: Added: Client now syncs the list of reports with the server and updates them if necessary.
* CLIENT: Added: Client now also knows what report filters are.

### --- v0.2.1 --- 28.05.23, 17.12 UTC+2 ---
* CLIENT: Fix: wrong delete order for reports which caused the local report to be deleted before the server report could be deleted

### --- v0.2.0 --- 28.05.23, 16.14 UTC+2 ---
* API: Added: Option to get all reportIds with an optional filter
* API: Added: Filter mask for reports
* CLIENT: Fix: Changed some more write -> report stuff

### --- v0.1.8 --- 28.05.23, 13.08 UTC+2 ---
* API: Added: Files can now be deleted by their id
* API: Change: Reports get now saved in a more human readable format
* API: Fix: successfully deleting a report sends now the correct response
* CLIENT: Fix: Changed some more write -> report stuff

### --- v0.1.7 --- 28.05.23, 11.38 UTC+2 ---
* API: Added: Files can now be get by their id
* CLIENT: Changed: /write -> /report and corresponding changes

### --- v0.1.6 --- 27.05.23, 17.00 UTC+2 ---
* API: Added: Middleware to check if a file exists (with and without report-link check)

### --- v0.1.5 --- 27.05.23, 16.45 UTC+2 ---
* API: Added: User can now request a list of all files linked to a report

### --- v0.1.4 --- 27.05.23, 14.40 UTC+2 ---
* API: Added: Uploaded and updated files for reports
* CLIENT: Added: if not already uploaded, files get now uploaded to the API
* CLIENT: Added: New function for updating the meta part of files
* API: CHANGED: Files now have no meta field anymore, instead it is given by the filename and position

### --- v0.1.3 --- 26.05.23, 23.50 UTC+2 ---
* API: Added: Uploaded and updated reports get now sieve through for the necessary fields to prevent not wanted data

### --- v0.1.2 --- 26.05.23, 21:25 UTC+2 ---
* API: Added: Reports can now be removed
* CLIENT: Added: If uploaded, reports get now also deleted on the API

### --- v0.1.1 --- 26.05.23, 20:49 UTC+2 ---
* API: Added: Reports can now be updated
* API: Added: restriction field for reports on API side
* API: Removed: Uploaded field for reports on API side
* CLIENT: Fix: Reports get now "pre-saved" before synced with API to prevent redraw before saving
* CLIENT: Added way to now fully sync (after first sync => update) reports on the server

### --- v0.1.0 ---
* API
* Proxy
* React-Redux App