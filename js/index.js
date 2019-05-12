Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
        heroes: Array,
        columns: Array,
    },
    data: function () {
        var sortOrders = [];
        this.columns.forEach(function(key) {
            sortOrders[key] = 0;
        });
        return {
            sortOrders: sortOrders,
            sorts: [],
        };
    },
    computed: {
        filteredHeroes: function() {
            var heroes = this.heroes;
            if (this.sorts.length === 1) {
                // Sort by specified key
                var key = Object.keys(this.sorts[0])[0];
                var self = this;
                heroes = heroes.slice().sort(function(a, b) {
                    a = a[key];
                    b = b[key];
                    return (a === b ? 0 : a > b ? 1 : -1) * self.sortOrders[key];
                });
            } else if (this.sorts.length >= 2) {
                // Stable sort in reverse order
                for (var i = this.sorts.length - 1 ; i >= 0; i--) {
                    var key = Object.keys(this.sorts[i])[0];
                    heroes = stableSort(heroes.slice(), key, this.sortOrders[key]);
                }
            }
            return heroes;
        },
    },
    methods: {
        sortBy: function(key) {
            this.sorts = [];
            var self = this;
            this.columns.forEach(function(k) {
                if (k != key) {
                    self.sortOrders[k] = 0;
                }
            });
            this.pushToSortArray(key, -1);
        },
        sortByShift: function(key) {
            // Remove duplicate keys from map
            var index =  this.sorts.findIndex(function(e) {
                return Object.keys(e)[0] === key;
            });
            if (index !== -1) {  // Not Found
                this.sorts.splice(index, 1);
            }
            this.pushToSortArray(key, index);
        },
        pushToSortArray: function(key, index) {
            // your/uri?sort=name,asc&sort=numberOfHands,desc (Spring Boot's way)
            // [ {"column-name": "asc"}, {"column-name": "desc"}, ... ]        
            var so = this.sortOrders[key];
            // Reverse in ascending order priority
            this.sortOrders[key] = (so === 0) ? 1 : (so === 1) ? -1 : 1;
            var hash = {};
            hash[key] = this.sortOrders[key];
            if (index == -1) {
                this.sorts.push(hash);
            } else {
                this.sorts.splice(index, 0, hash);
            }
        },
    },
});

function stableSort(array, key, order) {
    function compare(a, b, key, order) {
        var a_, b_;
        if (key == null) {
            a_ = a;
            b_ = b;
        } else {
            a_ = a[key];
            b_ = b[key];
        }
        if (a_ === b_) {
            return 0 * order;
        } else if (a_ > b_) {
            return 1 * order;
        } else {
            return -1 * order;
        }
    }

    if (array.length === 0) {
        return array;
    }
    // Create pair of array[original array, index]
    for (var i = 0; i < array.length; i++) {
       array[i] = [array[i], i];
    }
    array.sort(function(p1, p2) {
        var cmp = compare(p1[0], p2[0], key, order);
        if (cmp !== 0) {
            return cmp;
        } else {
            // If they are equal, returns the result of comparing index
            return p1[1] - p2[1];
        }
    });
     // Get the original array
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i][0];
    }
    return array;
 }
  
var demo = new Vue({
    el: '#demo',
    data: {
        gridColumns: ['id', 'name', 'power'],
        gridData: [
            {
                id: 1,
                name: 'Chuck Norris',
                power: 2000,
            },
            {
                id: 1,
                name: 'Chuck Norris',
                power: 1000,
            },
            {
                id: 1,
                name: 'Chuck Morris',
                power: 1000,
            },
            {
                id: 2,
                name: 'Bruce Lee',
                power: 9000,
            },
            {
                id: 3,
                name: 'Jackie Chan',
                power: 7000,
            },
            {
                id: 4,
                name: 'Jet Li',
                power: 8000,
            },
            {
                id: 5,
                name: 'Arnold Schwartz',
                power: 10000,
            }
        ],
    },
});

