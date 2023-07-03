## 0.7
### --- v0.7.0c --- 03.07.23, 19.15 UTC+2 ---
* Client: Added: New root for a file Viewer and fist implementation for images

### --- v0.7.0b --- 29.06.23, 16.05 UTC+2 ---
* Client: Changed: PreviewBox Mask restyling

### --- v0.7.0a --- 23.06.23, 16.05 UTC+2 ---
* Client: Added: New PreviewBox component for the Editor (and later for the Viewer)

## 0.6
### --- v0.6.3 --- 23.06.23, 13.19 UTC+2 ---
* Client: Fixed: Reports save now when a new image is uploaded

### --- v0.6.2 --- 19.06.23, 22.10 UTC+2 ---
* Client: Added: New ArchiveDB function to check if a report is already saved there
* Client: Added: Archived reports can now be saved for offline usage
* Client: Changed: The view tab for archived reports now recognizes if the report is saved for offline usage
* Client: Fix: Saved Tab now interprets the date as a DATE instead of a string

### --- v0.6.1 --- 19.06.23, 21.55 UTC+2 ---
* Client: Fixed: Archived reports now load files correctly again (Still not showing them)

### --- v0.6.0 --- 19.06.23, 13.30 UTC+2 ---
* Client: Added: Implemented the Archive overview
* Client: Added: View mode for Archived Reports (Files are not working yet)
* Client: Added: User can now archive Reports
* Client: Changed: Archive Type now has IDB_Files again instead of File

### --- v0.6.0e --- 15.06.23, 14.30 UTC+2 ---
* API: Fix: User route with custom id now returns the correct user info

### --- v0.6.0d --- 14.06.23, 14.15 UTC+2 ---
* ALL: Added: New field to query of reports for getting the author name
* Client: Fix: GetAllArchives now uses the archiveDB and not the reportDB

### --- v0.6.0c --- 14.06.23, 12.30 UTC+2 ---
* Client: Added: New component for locally stored archives
* Client: Added: Frame for online archive component
* Client: Changed: New possible fiel for author_name in report info requests

### --- v0.6.0b --- 12.06.23, 15.30 UTC+2 ---
* API: Added: New routes for getting user info about self and other users (username, groups, etc.)
* API: Added: Middleware check for userIDs
* ALL: Added: New Type for sharable user info and a mask for selecting the fields

### --- v0.6.0a --- 12.06.23, 14.28 UTC+2 ---
* Client: Added: Archive overview page
* Client: Added: "Offline" mode for current components
* Client: Added: Archive IDB store and functions

## 0.5
### --- v0.5.1 --- 10.06.23, 21.40 UTC+2 ---
* Client: Added: New AlertLoader class for better control
* Client: Changed: Report sync over Overview is now using the new AlertLoader for better status control

### --- v0.5.0 --- 10.06.23, 19.30 UTC+2 ---
* Client: Fixed: Editor is now working again
* Client: Fixed: Files are now correctly synced to the server
* API: Fixed: Some functions opened a db connection but never closed it

### --- b0.5.0c --- 10.06.23, 15.30 UTC+2 ---
### THIS IS A BROKEN BUILD, DO NOT USE IT
* Client: Changed: Reports that can be synced to a newer version, can now be sync in the overview
 
### --- b0.5.0b --- 09.06.23, 20.50 UTC+2 ---
### THIS IS A BROKEN BUILD, DO NOT USE IT
* Client: Added: New component cardBox for the overview 
* Client: Added: New component horizontalDivider for the overview
* Client: Changed: Overview does no longer sync Reports by itself, instead it is now only checking the state of the reports (uploaded, need update, need sync etc.)
* Client: Removed: Two unused indexes for the IDB store for Files
* Client: Changed: Date_Created is now an optional field for reports

### --- b0.5.0a --- 09.06.23, 15.05 UTC+2 ---
### THIS IS A BROKEN BUILD, DO NOT USE IT
* Client: IndexDB for reports is now split into two stores, local and remote
* Client: Removed: Uploaded fields for reports and files
* Client: Added: Type for stores selection (local, remote, all)
* Client: Changed: Report IDB functions now use the new store types
* Client: Broken: Overview and Edit are broken, because of the new IDB structure (Errors are commented out)

## 0.4
### --- v0.4.4 --- 09.06.23, 15.05 UTC+2 ---
* API: Added: Added filter for getting reports over their id to get only partial or full report meta data

### --- v0.4.3 --- 09.06.23, 13.55 UTC+2 ---
* API: Added: A new option to tell the API to return partial or full report meta data

### --- v0.4.2 --- 09.06.23, 11.55 UTC+2 ---
* API: Fixed: Get Reports now checks if a field is set instead of checking if it is not false

### --- v0.4.1 --- 09.06.23, 11.15 UTC+2 ---
* ALL: Changed: Report filers now contains a new field "archived"
* API: Added: New report filter for archived reports in getReports

### --- v0.4.0 --- 07.06.23, 16.52 UTC+2 ---
* API: Removed: Removed Achieve Table
* API: Removed: Archive middleware check
* API: Changed: Reports can now be un/archived via restrictions
* API: Changed: Restrictions have now a new field "archive"
* API: Added: Checks if a report is archived or not in get and update routes

## 0.3
### --- v0.3.8 --- 05.06.23, 12.42 UTC+2 ---
* API: Added: Archived Reports can now be "unarchived"
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

## 0.2
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

## 0.1
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