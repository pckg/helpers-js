<template>
    <div class="pckg-htmleditor">
        <textarea class="form-control" v-model="value" :id="id" @change="emitChange(value)"></textarea>
    </div>
</template>

<script>

/*import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/help';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/save';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/noneditable';*/

export default {
    name: 'pckg-htmleditor',
    props: {
        id: {
            default: function () {
                return 'pckg-editor-htmleditor' + parseInt(Math.random() * 1000000) % 1000000;
            }
        },
        value: {
            default: '',
            type: String
        },
        forcedRootBlock: {
            default: false
        },
        variables: {
            default: function(){
                return [];
            }
        }
    },
    model: {
        prop: 'value'
    },
    watch: {
        value: function (n, o) {
            if (n != o) {
                this.updateEditorValue();
            }
        }
    },
    data: function () {
        return {
            _editor: null
        };
    },
    methods: {
        emitChange: function (value) {
            this.$emit('input', value);
            this.$emit('change', value);
        },
        updateEditorValue: function () {
            if (this._editor && this._editor.getContent() != this.value) {
                this._editor.setContent(this.value || '');
            }
        },
        initEditor: function () {
            this.$nextTick(() => {
                initTinymce(this.id, {
                    forced_root_block: this.forcedRootBlock,
                    variables: this.variables,
                    setup: function (editor) {
                        this._editor = editor;
                        editor.on('Change', function (e) {
                            this.emitChange(this._editor.getContent());
                        }.bind(this)).on('KeyDown', function (e) {
                            this.emitChange(this._editor.getContent());
                        }.bind(this)).on('KeyUp', function (e) {
                            this.emitChange(this._editor.getContent());
                        }.bind(this));
                    }.bind(this)
                });
            });
        }
    },
    mounted: function () {
        this.initEditor();
    },
    destroyed: function () {
        destroyTinymce(this.id);
    }
}
</script>
