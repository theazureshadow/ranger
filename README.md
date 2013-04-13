# ranger #

Javascript utility library for manipulating ranges and sub-ranges.


## purpose ##

The original goal was to make it easier to manipulate textarea content,
especially with selections defined by `selectionStart` and `selectionEnd`. This
may eventually be used to implement some sort of operational transform on text,
but as of now it's somewhat experimental.


## state ##

This is very much a work in progress, and probably won't even function at the
moment. This document is mostly just to keep things straight.


## ranges ##

Ranges can be of many types, including `StringRange` and `ArrayRange`. The basic
ranges are named after the content backing them, and delegate their commands to
drivers that implements a pair of low-level editing commands: slice and replace.
There might even be a non-content base range, whose only concept is size. It's
not clear what it would do with commands like getContent -- it might just have
to return its length.

    var str = ranger.from("string");
    var sub = str.range(2);
    sub.slice(); // "ring"


## organization ##

`ranger` is the basic interface for creating ranges, and is the exported name of
the library.


### classes ###

`Ranger` -- The main interface to the class, providing utilities to build ranges
for arrays, strings, and numbers. An instance of this is exported at the end.

`ContentDriver` -- An interface that defines the essential functions for the
range representing actual content, like an array or string.

`StringContentDriver` -- The implementation of a content driver for string
content.

`AbstractBaseRange` -- Defines the methods needed to link content ranges and sub-
ranges.

`ContentRange` -- The base class for content ranges.

`StringRange` -- The implementation of a string content range.

`SubRange` -- The range that defines all of the content methods available on sub-
ranges that can get bubbled up to the content range.
