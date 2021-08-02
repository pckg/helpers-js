export default function (to) {
    if (!to.meta.tags || !to.meta.tags['seo:title']) {
        return;
    }

    const title = to.meta.tags['seo:title'];
    $store.dispatch('page/setSeo', {title: to.meta.tags['seo:title']});

    return title;
}
