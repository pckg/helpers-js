export default function (to) {
    if (!to.meta.tags || !to.meta.tags['seo:title']) {
        return;
    }

    let title = to.meta.tags['seo:title'];
    $('head title').html(title);

    return title;
}