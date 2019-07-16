# Database

This file describe the configurations used in Mongo database creation.

## Users

Two users were created for database: an Admin and another with permissions only in application database.

## Database

The application database is named *autocompleteevents*.

## Collections

There is only one collection on database, named *events*. This collection store the events data posted on API and, after, got using API.  

### Events collection

The events has only two required fields, *event* and *date* and others attributes are allowed.  
The *date* attribute is a timestamp, with the javascript *Date* format.
