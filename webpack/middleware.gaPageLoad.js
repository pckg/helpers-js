export default function (to, title) {
    if (typeof gtag === 'undefined') {
        return;
    }

    let event = {
        page_title: title,
        page_location: location.origin + to.path,
        page_path: to.path
    };
    console.log('sending event', event, to);
    gtag('event', 'page_view', event);
}