export class Record {

    constructor(data, relations) {
        this.$data = data || {};
        this.$relations = relations || {};
        // this.copyData(data || {});
        //this.copyRelations(relations || {});
        this.$entity = Entity;
        let object = this;
        this.$fetches = {};

        return new Proxy(this, {
            /*set: (object, key, value, proxy) => {
                return object.__set.call(object, key, value);
            },*/
            get: (object, key) => {
                return object.__get.call(object, key);
            },
            apply: (target, params) => {
                return object.__apply.call(object, params, target);
            },
            ownKeys: () => {
                return object.ownKeys();
            }
        });
    }

    /*copyData(data) {
        $.each(data, function (key, val) {
            this[key] = val;
        }.bind(this));
    }

    copyRelations(relations) {
        $.each(relations, function (key, val) {
            this[key] = val;
        }.bind(this));
    }*/

    __set(key, value) {
        if (key.indexOf('$') === 0) {
            this[key] = value;
            return true;
        }

        this.$data[key] = value;
        return this;
    }

    __get(key) {
        if (typeof key !== 'string' || key.indexOf('_') === 0 || key.indexOf('$') === 0) {
            return this[key];
        }

        if (this.hasOwnProperty('get' + utils.ucfirst(key) + 'Attribute')) {
            return this['get' + utils.ucfirst(key) + 'Attribute'].call(this);
        }

        if (this['get' + utils.ucfirst(key) + 'Relation']) {
            return this['get' + utils.ucfirst(key) + 'Relation'].call(this);
        }

        if (this.$data.hasOwnProperty(key)) {
            return this.$data[key];
        }

        return this[key];
    }

    __apply(params, target) {
        return target(...params);
    }

    ownKeys() {
        let def = this.$definition;
        let keys = [Object.keys(this), def ? def().relations : []];
        let finalKeys = {};
        $.each(keys, function (i, group) {
            $.each(group, function (j, key) {
                if (false && (key.indexOf('$') === 0 || key.indexOf('_') === 0)) {
                    return;
                }
                finalKeys[key] = key;
            });
        });

        finalKeys = Object.keys(finalKeys);

        return finalKeys;
    }

    $autoFetch(key, foreign) {
        let slug = Array.isArray(key) ? key[0] : key; // network-interfaces
        let camel = Array.isArray(key) ? key[1] : key; // networkInterfaces

        if (!this[camel]) {
            this[camel] = [];
        }

        if (!this.id) {
            return this[camel];
        }

        this.$fetcher(camel, function () {
            let f = new foreign();
            return (new this.$entity()).all([this.id, slug]).then(function (items) {
                this[camel] = items.map(function (item) {
                    return new f.$record(item);
                }.bind(this));
            }.bind(this));
        }.bind(this));

        return this[camel];
    }

    $fetcher(key, fetcher) {
        if (this.$fetches[key]) {
            //this.$fetches[key].catch(fetcher);
            return;
        }

        this.$fetches[key] = fetcher().finally(function () {
            // delete this.$fetches[key];
        }.bind(this));
    }

    toJSON() {
        let data = {};
        $.each(Object.keys(this), function (i, key) {
            if (key.indexOf('$') === 0 || key.indexOf('_') === 0) {
                return;
            }

            data[key] = this[key];
        }.bind(this));

        let def = this.$definition;
        if (def) {
            $.each(def().relations, function (i, r) {
                data[r] = this[r];
            }.bind(this));
        }

        let cache = [];
        let strigified = JSON.stringify(data, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    try {
                        return JSON.parse(JSON.stringify(value));
                    } catch (error) {
                        return null;
                    }
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
        cache = null;
        return strigified;
    }

    data(key, def) {
        if (typeof def == 'undefined') {
            def = null;
        }

        return this[key] || def;
    }

    relation(key, def) {
        if (typeof def == 'undefined') {
            def = [];
        }

        return this[key] || def;
    }

    getEntity() {
        return new this.$entity;
    }

    save() {
        let data = this.$data;

        if (data.id) {
            return this.update();
        } else {
            return this.insert();
        }
    }

    update() {
        let entity = this.getEntity();
        let repository = entity.getRepository();
        let data = this.$data;

        if (!data.id) {
            return;
        }

        let finalPath = entity.getApiPath();

        if (!finalPath) {
            return;
        }

        finalPath += '/' + data.id;

        return repository.post(finalPath, this.$data);
    }

    insert() {
    }

    delete() {
    }

    static get() {
    }

    get() {
        return this.$data;
    }

}

export class Query {

    constructor() {
        this.$binds = [];
        this.$children = [];
        this.$fields = {};
        this.$limit = null;
        this.$page = 1;
        this.$direction = null;
        this.$sort = null;
        this.$search = null;
        this.$meta = {};
    }

    select(fields) {
        this.$fields = fields;

        return this;
    }

    search(search) {
        this.$search = search;

        return this;
    }

    getSearch() {
        return this.$search;
    }

    addSelect(fields) {
        if (typeof fields == 'string') {
            let t = {};
            t[fields] = fields;
            fields = t;
        }

        this.$fields = Object.assign(this.$fields, fields);

        return this;
    }

    getFields() {
        return this.$fields;
    }

    where(key, val = true, comparator = '=') {
        this.$children.push({
            k: key,
            v: val,
            c: comparator
        });

        return this;
    }

    limit(limit) {
        this.$limit = limit;

        return this;
    }

    getLimit() {
        return this.$limit;
    }

    page(page) {
        this.$page = page;

        return this;
    }

    getPage() {
        return this.$page;
    }

    sort(sort) {
        this.$sort = sort;

        return this;
    }

    getSort() {
        return this.$sort;
    }

    direction(direction) {
        this.$direction = direction;

        return this;
    }

    getDirection() {
        return this.$direction;
    }

    getFilters() {
        return this.$children;
    }

    setMeta(meta) {
        this.$meta = meta;

        return this;
    }

    getMeta() {
        return this.$meta;
    }

}

export class Entity {

    constructor(repository) {
        this.$path = null;
        this.$record = Record;
        this.$repository = Repository;
        this.$repositoryObject = repository || null;
        this.$query = Query;
    }

    setPath(path) {
        this.$path = path;

        return this;
    }

    getQuery() {
        if (typeof this.$query !== 'object') {
            this.$query = new Query();
        }

        return this.$query;
    }

    where(key, val, comparator) {
        this.getQuery().where(key, val, comparator);

        return this;
    }

    limit(limit) {
        this.getQuery().limit(limit);

        return this;
    }

    page(page) {
        this.getQuery().page(page);

        return this;
    }

    getRepository(create) {
        if (!this.$repositoryObject || create) {
            this.$repositoryObject = new this.$repository;
        }

        return this.$repositoryObject;
    }

    getApiPath(path) {
        // path: null -> /api/users
        // path: null -> /api/users
        // path: admin -> /api/users/admin
        // path: [1] -> /api/users/1
        // path: [1, 'orders'] -> /api/users/1/orders
        // path: [1, 'order', 2] -> /api/users/1/order/2
        // path: /test -> /api/test

        // first check for path
        let apiPath = this.$path;

        if (!apiPath && !path) {
            return null;
        }

        // build fetch path
        let finalPath = apiPath ? '/' + apiPath : '';
        if (typeof path === 'string') {
            if (path.indexOf('/') === 0) {
                finalPath = path;
            } else {
                finalPath += '/' + path;
            }
        } else if (typeof path == 'number') {
            finalPath += "/" + path;
        } else if (Array.isArray(path) && path.length > 0) {
            finalPath += '/' + path.join('/');
        } else if (!path) {
            let query = this.$query;
            if (typeof query == 'object' && query.$children.length == 1) {
                let first = query.$children[0];
                if (first.key == 'id' && first.comparator === '=') {
                    finalPath += '/' + first.value;
                }
            }
        }

        return finalPath;
    }

    one(id) {
        /*if (id) {
            this.where('id', id);
            id = null;
        }*/

        let finalPath = this.getApiPath(id);

        return this.getRepository().one(finalPath).then(function (d) {
            let keys = Object.keys(d);
            return new this.$record(keys.length == 1 ? d[keys[0]] : {});
        }.bind(this));
    }

    exp(path, dataCallback) {
        let finalPath = this.getApiPath(path);

        return this.getRepository().exp(finalPath, this.getQuery()).then(function (d) {
            if (dataCallback) {
                dataCallback(d);
            }

            return d;
        }.bind(this));
    }

    all(path, dataCallback) {
        let finalPath = this.getApiPath(path);

        return this.getRepository().all(finalPath, this.getQuery()).then(function (d) {
            let keys = Object.keys(d);
            let r = this.$record;
            let key = keys[0];
            if (keys.length > 1) {
                if (keys.indexOf('records') >= 0) {
                    key = 'records';
                }
            }
            let mapped = d[key].map(function (item) {
                return new r(item);
            }.bind(this));

            if (dataCallback) {
                dataCallback(d);
            }

            return mapped;
        }.bind(this));
    }

    get(path, params) {
        let finalPath = this.getApiPath(path);

        if (!finalPath) {
            return;
        }

        return this.getRepository().get(finalPath, params).then(function (d) {
            let keys = Object.keys(d);
            return (keys.length == 1 ? d[keys[0]] : []).map(function (item, i) {
                return new this.$record(item);
            }.bind(this));
        }.bind(this));
    }

    post(path, params) {
        let finalPath = this.getApiPath(path);

        if (!finalPath) {
            return;
        }

        return this.getRepository().post(finalPath, params).then(function (d) {
            let keys = Object.keys(d);
            return (keys.length == 1 ? d[keys[0]] : []).map(function (item, i) {
                return new this.$record(item);
            }.bind(this));
        }.bind(this));
    }

}

export class Collection {

    constructor(items) {
        this.$items = items || [];
    }

    map(mapper) {
        return this.$items.map(mapper)
    }

}

export class Repository {

    constructor(repository) {
        console.log('Repository repository', repository);
        this.$repository = HttpRepository;
        this.$repositoryObject = repository || null;
    }

    getRepository(create) {
        if (!this.$repositoryObject || create) {
            this.$repositoryObject = new this.$repository;
        }

        return this.$repositoryObject;
    }

    one(path) {
        return this.getRepository().one(path);
    }

    all(path, query) {
        return this.getRepository().all(path, query);
    }

    get(path) {
        return this.getRepository().get(path);
    }

    post(path, params) {
        return this.getRepository().post(path, params);
    }

    exp(path, params) {
        return this.getRepository().exp(path, params);
    }

}

/**
 * Makes all requests to /api with path as suffix -> /api/servers/1/services
 */
export class HttpRepository {

    constructor(endpoint = '/api') {
        this.$endpoint = endpoint;
    }

    setEndpoint(endpoint) {
        this.$endpoint = endpoint;

        return this;
    }

    getQueryHeaders(query) {
        return {
            'X-Pckg-Orm-Meta': JSON.stringify(query ? query.getMeta() : null),
            'X-Pckg-Orm-Search': JSON.stringify(query ? query.getSearch() : null),
            'X-Pckg-Orm-Filters': JSON.stringify(query ? query.getFilters() : []),
            'X-Pckg-Orm-Fields': JSON.stringify(query ? query.getFields() : []),
            'X-Pckg-Orm-Paginator': JSON.stringify(query ? {
                page: query.getPage(),
                limit: query.getLimit(),
                sort: query.getSort(),
                dir: query.getDirection()
            } : {
                page: 1,
                limit: null,
                sort: null,
                dir: null
            }),
        };
    }

    makeGetRequest(path, query) {
        return (new Promise(function (resolve, reject) {
            http.get((this.$endpoint || '') + path, function (data) {
                // return array
                resolve(data);
            }, function (data) {
                // return array
                reject({message: 'Error making HTTP GET request', data: data});
            }, {headers: this.getQueryHeaders(query)});
        }.bind(this)));

    }

    get(path) {
        return this.makeGetRequest(path);
    }

    one(path) {
        return this.makeGetRequest(path);
    }

    all(path, query) {
        return this.makeGetRequest(path, query);
    }

    exp(path, query) {
        return this.makeGetRequest(path, query);
    }

    post(path, params) {
        return new Promise(function (resolve, reject) {
            // make post request
            http.post((this.$endpoint || '') + path, params, function (data) {
                // this is what api returns
                let dataObject = {id: 3, title: 'Three'};

                // return object
                resolve(dataObject);
            }.bind(this), function (data) {
                reject(data);
            });
        }.bind(this));
    }

}

/**
 * Makes all requests to $endpoint (/api) with GET parameter path (servers, servers/1, servers/1/services, ...).
 */
export class HttpQLRepository extends HttpRepository {

    all(path, query) {
        return this.makeSearchRequest(path, query);
    }

    makeGetRequest(path, query) {
        return (new Promise(function (resolve, reject) {
            let options = {type: 'SEARCH'};
            let queryData = this.getQueryHeaders(query);

            let length = JSON.stringify(queryData).length;
            options[true || length > 6144 ? 'data' : 'headers'] = queryData;

            // make http get request
            http.get((this.$endpoint || '') + '?path=' + path, function (data) {
                // return array
                resolve(data);
            }, function (data) {
                // return array
                reject({message: 'Error making HTTP GET request', data: data});
            }, options);
        }.bind(this)));

    }

    makeSearchRequest(path, query) {
        return (new Promise(function (resolve, reject) {
            let options = {type: 'SEARCH'};
            let queryData = this.getQueryHeaders(query);

            let length = JSON.stringify(queryData).length;
            options[true || length > 6144 ? 'data' : 'headers'] = queryData;

            // make http get request
            http.get((this.$endpoint || '') + '?path=' + path, function (data) {
                // return array
                resolve(data);
            }, function (data) {
                // return array
                reject({message: 'Error making HTTP SEARCH request', data: data});
            }, options);
        }.bind(this)));

    }

}