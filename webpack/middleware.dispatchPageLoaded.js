export default function () {
    typeof $vue !== 'undefined' && setTimeout(() => $dispatcher.$emit('page:loaded'), 666);
}