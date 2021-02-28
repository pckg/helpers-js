export function render(h) {
    if (!this.templateRender) {
        if (this.$options.template) {
            return this.$options.template;
        }

        return h('div', 'Loading ...');
    }

    try {
        return this.templateRender();
    } catch (e) {
        console.log(e);
        return h('div', 'Error rendering template');
    }
}

export function inComponentCompiler(template) {

    let res;
    let b = template || '';
    console.log('Building template', template);

    try {
        res = Vue.compile(b);
        console.log('built', res);
    } catch (e) {
        console.log(e, b, res, this);
        res = Vue.compile('<p>Error building template</p>');
    }

    this.templateRender = res.render;
    this.$options.staticRenderFns = [];
    this._staticTrees = [];
    if (res.staticRenderFns) {
        for (var i in res.staticRenderFns) {
            this.$options.staticRenderFns.push(res.staticRenderFns[i]);
        }
    }

}
