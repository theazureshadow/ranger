var ranger = (function() {
    // Define some utility methods
    /** Have Child inherit from Parent */
    function inherit(ChildClass, ParentClass) {
        /** @constructor */
        function Between() {}
        Between.prototype = ParentClass.prototype;
        ChildClass.prototype = new Between();
        ChildClass.prototype.constructor = ChildClass;
    }


    /**
     * Calculates a position offset according to the containing range. Handles
     * negatives as counting from the end, and null or undefined as start or
     * end.
     */
    function normalizePosition(position, length, defaultToEnd) {
        if (position === null || typeof position === 'undefined') {
            return defaultToEnd ? length : 0;
        }
        if (position < 0) {
            position = length + position;
        }
        position = Math.max(0, position);
        position = Math.min(position, length);
        return position;
    }
    /**
     * Calculates a start offset according to the containing range. Handles
     * negatives as counting from the end, and null or undefined as start.
     */
    function normalizeStart(position, length) {
        return normalizePosition(position, length, false);
    }
    /**
     * Calculates an end offset according to the containing range. Handles
     * negatives as counting from the end, and null or undefined as end.
     */
    function normalizeEnd(position, length) {
        return normalizePosition(position, length, true);
    }

    /** @interface */
    function ContentDriver(content) {}
    /**
     * @param start The start index. If negative, measures from the end. If
     * missing, includes the beginning.
     * @param end The end index. If negative, measures from the end. If missing,
     * includes the end.
     */
    ContentDriver.prototype.slice = function(start, end) {};

    /**
     * @param start The start index.
     * @param end The end index.
     * @param newContent The content with which to replace the old content.
     */
    ContentDriver.prototype.replace = function(start, end, newContent) {};

    /**
     * @return {number} The length of this range.
     */
    ContentDriver.prototype.length = function() {};


    /**
     * Represents a base range of a string.
     * @implements ContentDriver
     * @constructor
     */
    function StringContentDriver(content) {
        /** @type {string} */
        this.content = content;
    }

    /**
     * Implements the view primitive
     */
    StringContentDriver.prototype.slice = function(start, end) {
        var length = this.length();
        start = normalizeStart(start, length);
        end = normalizeEnd(end, length);
        return this.content.substr(start, end - start);
    };

    /**
     * Implements the replacement primitive for modifying.
     */
    StringContentDriver.prototype.replace = function(start, end, newContent) {
        var content, oldContent, length, before, during, after;
        length = this.length();
        start = normalizeStart(start, length);
        end = normalizeEnd(end, length);
        content = this.content;
        // Get the oldContent for returning.
        oldContent = content.substr(start, length);
        // Get the new pieces of content.
        before = content.substr(0, start);
        during = newContent;
        after = content.substr(end);
        // Join the new pieces of content.
        this.content = [before, during, after].join('');
        return oldContent;
    };

    StringContentDriver.prototype.length = function() {
        return this.content.length;
    };


    /**
     * @constructor
     */
    function RootRange() {}

    RootRange.prototype.slice = function(start, end) {
        return this.driver.slice(start, end);
    };

    RootRange.prototype.replace = function(start, end, content) {
        return this.driver.replace(start, end, content);
    };

    /** @type {ContentDriver} */
    RootRange.prototype.driver = null;


    /** @constructor @extends RootRange */
    function StringRange(string) {
        this.driver = new StringContentDriver(string);
    }
    inherit(StringRange, RootRange);


    /** @constructor */
    function SubRange() {}

    // Position manipulation and information
    /** Get or set the start position. */
    SubRange.prototype.start = function(position) {};
    /** Get or set the end position. */
    SubRange.prototype.end = function(position) {};
    /** Get the length of this range. */
    SubRange.prototype.length = function() {};
    /** Extend the range to include position. */
    SubRange.prototype.include = function(position) {};

    // Relative position
    /** Shift the range a certain number of places. Negative shifts left. */
    SubRange.prototype.shift = function(offset) {};
    /** Shift the start a certain number of places. Negative shifts left. */
    SubRange.prototype.shiftStart = function(offset) {};
    /** Shift the end a certain number of places. Negative shifts left. */
    SubRange.prototype.shiftEnd = function(offset) {};

    // Content manipulation
    /** Get or set content. */
    SubRange.prototype.content = function(content) {};
    /** Insert text at the beginning of this range. */
    SubRange.prototype.prepend = function(content) {};
    /** Insert text at the end of this range. */
    SubRange.prototype.append = function(content) {};
    /** Insert text before the beginning of this range. */
    SubRange.prototype.before = function(content) {};
    /** Insert text after the end of this range. */
    SubRange.prototype.after = function(content) {};
    /** Remove all content from this range. */
    SubRange.prototype.clear = function() {};


    // Store a reference to the old ranger object
    var oldRanger = ranger;


    // Represents the top-level Ranger interface
    /** @constructor */
    function Ranger() {}

    /**
     * Sets ranger to be the original ranger and returns a reference to this.
     * @return this
     */
    Ranger.prototype.noConflict = function() {
        ranger = oldRanger;
        return this;
    };

    Ranger.prototype.fromString = function(string) {
        return new StringRange(string);
    };

    // Export Ranger instance
    return new Ranger();
}());
