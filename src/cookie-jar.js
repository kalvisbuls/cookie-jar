/*global window,XMLHttpRequest,ActiveXObject,console,document*/
/**
 * Description
 *
 * Couple of libraries combined together for usage when jQuery is not used
 * Included are:
 * Cookie library with a full Unicode support (based on a framework created by Mozilla with a few improvements)
 * Ajax library
 * Error handling library
 * This library is released under the GNU Public License, version 3 or later.
 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
 */
(function () {
    'use strict';
    var CookieJar = window.CookieJar = {},
        ErrorHandler = {},
        CookieFactory = {},
        CookieFormatter = {},
        Dates = {
            expired: 'Jan 1, 1970 0:00:00 GMT',
            future: 'Jan 19, 2038 3:13:07 GMT'
        };

    /**
     * Throws an object with a string representation option
     *
     * @param name
     * @param message
     */
    ErrorHandler.throwNewException = function (name, message) {
        throw {
            name: name,
            message: message,
            toString: function () {
                return this.name + ": " + this.message;
            }
        };
    };

    /**
     * Creates a new cookie
     */
    CookieFactory.build = function (options) {
        if (!options.name) {
            ErrorHandler.throwNewException("Missing Argument", "A name must be set");
        }

        if ((/^(?:expires|max\-age|path|domain|secure)$/i).test(options.name)) {
            ErrorHandler.throwNewException("Error", "Name must not contain any of the reserved keywords");
        }

        return {
            name: options.name,
            value: options.value || '',
            expires: options.expires || '',
            path: options.path || '',
            domain: options.domain || '',
            secure: Boolean(options.secure)
        };
    };

    /**
     * Gets the date string for working with cookie expiration dates
     */
    CookieFormatter.getDateString = function (date) {
        if (date.constructor === String) {
            return new Date(date).toUTCString();
        }

        return date.toUTCString();
    };

    /**
     * Parses the cookie to a string representation
     *
     * @param cookie
     * @returns {string}
     */
    CookieFormatter.parseToString = function (cookie) {
        var result = [];
        result.push(cookie.name + '=' + cookie.value);

        if (cookie.expires) {
            result.push('; expires=' + cookie.expires);
        }

        if (cookie.path) {
            result.push('; path=' + cookie.path);
        }

        if (cookie.domain) {
            result.push('; domain=' + cookie.domain);
        }

        if (cookie.secure) {
            result.push('; secure');
        }

        return result.join('');
    };

    /**
     * Converts the specific symbols in cookie values to their URI representations
     */
    CookieFormatter.format = function (cookie) {
        cookie.name = encodeURIComponent(cookie.name);
        cookie.value = encodeURIComponent(cookie.value);

        if (cookie.expires) {
            cookie.expires = this.getDateString(cookie.expires);
        }

        return this.parseToString(cookie);
    };

    /**
     * Sets a new cookie
     *
     * Usage:
     * CookieJar.set({
     * name: 'My Cookie',
     * value: 'Cookie value',
     * expires: 'Jan 11, 2015 2:10:01 GMT', (alternatively - new Date(2015, 1, 11, 2, 10, 1))
     * path: '/en/blog',
     * domain: 'domain.example.com',
     * secure: true
     * });
     */
    CookieJar.set = function (options) {
        document.cookie = CookieFormatter.format(CookieFactory.build(options));

        return true;
    };

    /**
     * Sets a 'forever' type of a cookie
     *
     * Usage:
     * CookieJar.forever({
     * name: 'My Cookie',
     * value: 'Cookie value',
     * domain: 'domain.example.com'
     * });
     */
    CookieJar.forever = function (options) {
        options.expires = Dates.future;

        return this.set(options);
    };

    /**
     * Checks whether a cookie with a given name currently exists
     *
     * Usage:
     * CookieJar.has('My Cookie');
     */
    CookieJar.has = function (name) {
        if (!name) {
            return false;
        }

        var encodedName = encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&"),
            cookieFound = function (name) {
                return new RegExp("(?:^|;\\s*)" + name + "\\s*\\=").test(document.cookie);
            };

        return cookieFound(encodedName);
    };

    /**
     * Returns a previously set cookie
     *
     * Usage:
     * CookieJar.get('My Cookie');
     */
    CookieJar.get = function (name) {
        var encodedName = encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&"),
            searchPattern = new RegExp("(?:(?:^|.*;)\\s*" + encodedName + "\\s*\\=\\s*([^;]*).*$)|^.*$"),
            cookie = document.cookie.replace(searchPattern, '$1');

        return decodeURIComponent(cookie) || null;
    };

    /**
     * Destroys a cookie (actually sets it as expired)
     *
     * Usage:
     * CookieJar.forget({
     * name: 'My Cookie',
     * path: '/en/blog',
     * domain: 'domain.example.com'
     * });
     */
    CookieJar.forget = function (name, path, domain) {
        if (!this.has(name)) {
            return false;
        }

        return this.set({
            name: name,
            value: 'expired',
            expires: Dates.expired,
            path: path,
            domain: domain
        });
    };

    /**
     * Returns all previously set cookies
     *
     * Usage:
     * CookieJar.all();
     */
    CookieJar.all = function () {
        var cookies = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, ''),
            keys = cookies.split(/\s*(?:\=[^;]*)?;\s*/),
            counter = 0;

        for (counter; counter < keys.length; counter += 1) {
            keys[counter] = decodeURIComponent(keys[counter]);
        }

        return keys;
    };

    if (!Date.prototype.addMinutes) {
        /**
         * Sets the addMinutes function for Date objects
         *
         * @param minutes
         * @returns {Date}
         */
        Date.prototype.addMinutes = function (minutes) {
            this.setMinutes(this.getMinutes() + minutes);

            return this;
        };
    }

    if (!Date.prototype.addHours) {
        /**
         * Sets the addHours function for Date objects
         *
         * @param hours
         * @returns {Date}
         */
        Date.prototype.addHours = function (hours) {
            this.setHours(this.getHours() + hours);

            return this;
        };
    }

    if (!Date.prototype.addDays) {
        /**
         * Sets the addMonths function for Date objects
         *
         * @param days
         * @returns {Date}
         */
        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + days);

            return this;
        };
    }
}());