T-Shirt List
==============

T-Shirt List is listing implementation

**Available Configuration**

1. config: [], // The config: check, value, input, side and find.
2. data: [], // Multi array data to be displayed
3. placeholder: "Type to find", // The wording for the search bar
4. cantfind: "Can't find the string you're looking", // The words when can't find the search term
5. empty: "Can't find any data right now", // The words when the data is empty
6. highlight: true, // Set false to disable highlight on search result, faster for huge data
7. multipleSelect: false, // Set true to make it multiple select
8. onClick: function (element) {}, // A callback when the list get clicked

**How to use**

	$("#list").list();
