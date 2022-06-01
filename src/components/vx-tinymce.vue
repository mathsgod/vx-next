<template>
  <div>
    <tinymce :init="mceInit" v-model="localValue" :api-key="apiKey"></tinymce>

    <q-dialog v-model="showFM" full-width>
      <vx-file-manager
        v-model="content"
        @input="onSelectFile($event)"
        file-type="image"
        :accept="accept"
        default-action="select"
        show-close-button
        @close="showFM = false"
      ></vx-file-manager>
    </q-dialog>

    <el-dialog v-model="showCode" title="Code">
      <Codemirror v-model:value="content" class="mb-1" :options="cmOptions" />
      <div class="mt-2">
        <el-button type="primary" @click="onCodeOK()">OK</el-button>
        <el-button @click="showCode = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tinymce from "@tinymce/tinymce-vue";

import Codemirror from "codemirror-editor-vue3";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/addon/edit/closetag.js";

export default {
  components: {
    tinymce: tinymce,
    Codemirror,
  },
  props: {
    value: String,
    accept: String,
    height: {
      type: Number,
      default: 600,
    },

    baseUrl: {
      type: String,
      default: "/uploads/",
    },

    apiKey: String,
  },

  data() {
    return {
      localValue: this.value,
      mceInit: {},
      showFM: false,
      editor: null,
      showCode: false,
      content: "",
      cmOptions: {
        lineNumbers: true,
        mode: "htmlmixed",
        autoCloseTags: true,
        foldGutter: true,
      },
    };
  },
  created() {
    let that = this;
    this.mceInit = {
      height: this.height,
      apply_source_formatting: true,
      convert_urls: false,
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],
      toolbar:
        "filemanager cm " +
        "undo redo | blocks | " +
        "bold italic backcolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      init_instance_callback() {
        if (!that.apiKey) {
          let freeTiny = document.querySelector(".tox-notifications-container");
          freeTiny.style.display = "none";
        }
      },
      setup(editor) {
        that.editor = editor;
        editor.ui.registry.addButton("filemanager", {
          text: "File manager",
          onAction: (_) => {
            that.showFM = true;
          },
        });

        editor.ui.registry.addButton("cm", {
          text: "Code",
          onAction: (_) => {
            that.content = editor.getContent();
            console.log(that.content);
            that.showCode = true;
          },
        });
      },
    };
  },
  mounted() {},
  watch: {
    value() {
      this.localValue = this.value;
    },
    localValue() {
      this.$emit("input", this.localValue);
    },
  },
  methods: {
    onCodeOK() {
      this.editor.setContent(this.content);
      this.showCode = false;
    },
    onSelectFile(path) {
      console.log("insert content");
      this.showFM = false;
      let img = document.createElement("img");
      //img.src = "http://192.168.88.108:8001/vx/uploads/" + path;
      img.src = this.baseUrl + path;

      this.editor.insertContent(img.outerHTML);
    },
  },
};
</script>
