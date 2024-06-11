<template>
  <input v-model="name" type="text" name="nameField" id="name" />
  <button @click="download()" id="download-button">Download</button>
  <p>Choosable syntax</p>
  <ul class="chips">
    <li v-for="(s, i) in syntax" :key="i" @click="name += s">
      {{ s }}
    </li>
  </ul>
  <select @change="updateDate" name="dateFormat" id="dateFormat">
    <option
      v-for="date in dateFormat.dates"
      :value="date.id"
      :data-date="date.id"
      :key="date.id"
    >
      {{ date.name }}
    </option>
  </select>
  <input
    v-model="isExportFrameSizeChecked"
    type="checkbox"
    id="exportFrameSize"
    name="exportFrameSize"
  />
  <label for="exportFrameSize">export in frame size</label><br />
  <select @change="updateFormat" name="fileFormat" id="fileFormat">
    <option
      v-for="format in fileFormat.formats"
      :value="format.id"
      :data-format="format.id"
      :key="format.id"
    >
      {{ format.name }}
    </option>
  </select>
  <select @change="updateScaling" name="scaling" id="scaling">
    <option
      v-for="scaling in scaling.scalings"
      :key="scaling.id"
      :data-scaling="scaling.id"
      :value="scaling.id"
    >
      {{ scaling.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: "App",
  data: {
    name: "",
    isExportFrameSizeChecked: false,
    syntax: ["{{ name }}", "{{ date }}", "{{ file }}", "{{ scaling }}"],
    dateFormat: {
      selected: null,
      dates: [
        {
          id: 0,
          name: "YYMMDD",
        },
        {
          id: 1,
          name: "YYY-MM-DD",
        },
        {
          id: 2,
          name: "DD-MM-YYYY",
        },
        {
          id: 3,
          name: "MM-DD-YYYY",
        },
      ],
    },
    fileFormat: {
      selected: null,
      formats: [
        {
          id: 0,
          name: "PNG",
        },
        {
          id: 1,
          name: "JPG",
        },
        {
          id: 2,
          name: "SVG",
        },
        {
          id: 3,
          name: "PDF",
        },
      ],
    },
    scaling: {
      selected: null,
      scalings: [
        {
          id: 1,
          name: "x1",
        },
        {
          id: 2,
          name: "x2",
        },
        {
          id: 3,
          name: "x3",
        },
        {
          id: 4,
          name: "x4",
        },
      ],
    },
  },
  methods: {
    updateDate(e) {
      if (e.target.options.selectedIndex > -1) {
        this.dateFormat.selected =
          e.target.options[e.target.options.selectedIndex].dataset.date;
      }
    },
    updateFormat(e) {
      if (e.target.options.selectedIndex > -1) {
        this.fileFormat.selected =
          e.target.options[e.target.options.selectedIndex].dataset.format;
      }
    },
    updateScaling(e) {
      if (e.target.options.selectedIndex > -1) {
        this.scaling.selected =
          e.target.options[e.target.options.selectedIndex].dataset.scaling;
      }
    },
    download() {
      const pluginMessage = JSON.stringify({
        type: "01-collect-data",
        name: this.name,
        dateFormat: this.dateFormat.selected,
        fileFormat: this.fileFormat.selected,
        scaling: this.scaling.selected,
        isExportFrameSizeChecked: this.isExportFrameSizeChecked,
      });
      parent.postMessage(
        {
          pluginMessage,
        },
        "*"
      );
    },
    byteDataToBlob(byteData) {
      return new Blob([new Uint8Array(byteData)], { type: "image/png" });
    },
    // MULTIPLE FILE EXPORT AS ZIP
    async downloadZip(files) {
      const zip = new JSZip();

      // each asset in the bundle will be added as seperated images to the zip
      files.forEach((file) => {
        zip.file(`${file.name}.png`, byteDataToBlob(file.binaryData[0]), {
          base64: true,
        });
      });

      // zip file will be generated here
      zip.generateAsync({ type: "blob" }).then((content) => {
        const zipName = "assets";

        // create and click a temporary link to download the Blob
        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.className = "button button--primary";
        link.href = blobURL;
        link.download = `${zipName}.zip`;
        link.click();
        link.setAttribute("download", `${zipName}.zip`);

        // clean up the blobURL and link element
        window.URL.revokeObjectURL(blobURL);
        link.remove();
      });
    },
    // SINGLE FILE EXPORT
    downloadSingleFile(file) {
      // the blob type is file specific
      let blob;
      if (file.format === "PNG") {
        blob = new Blob(file.binaryData, { type: "image/png" });
      } else if (file.format === "JPG") {
        blob = new Blob(file.binaryData, { type: "image/jpg" });
      } else if (file.format === "SVG") {
        blob = new Blob(file.binaryData, { type: "image/svg+xml" });
      } else if (file.format === "PDF") {
        blob = new Blob(file.binaryData, { type: "application/pdf" });
      } else {
        console.error("undefined or unknown file format");
      }

      // create and click a temporary link to download the Blob
      const blobURL = window.URL.createObjectURL(blob);
      const linkEl = document.createElement("a");
      linkEl.href = blobURL;
      linkEl.download = `${file.name}.${file.format}`;
      linkEl.click();
      linkEl.setAttribute("download", `${file.name}.${file.format}`);

      // clean up the blobURL and link element
      window.URL.revokeObjectURL(blobURL);
      linkEl.remove();
    },
  },
  mounted() {
    // General message receiver
    window.onmessage = (msg) => {
      const m = msg.data.pluginMessage;
      // get the bundled information, including image data + config information
      if (m.type === "02-export-bundle") {
        const exportBundle = m.exportBundle;
        // depending on if the user has selected one or multiple images, start a function that downloads a single image or a zip file
        exportBundle.length > 1
          ? downloadZip(exportBundle)
          : downloadSingleFile(exportBundle[0]);
      }
    };
  },
};
</script>

<style lang="scss" scoped>
body {
  background-color: var(--bg);
  color: var(--text);
}

.figma-dark {
  --text: #e9e9e9;
  --bg: #242424;
}

.figma-light {
  --text: #242424;
  --bg: #e9e9e9;
}

.chips {
  list-style: none;
}

.chips {
  li {
    display: inline-block;
    width: 60px;
    height: 24px;
    text-align: center;
    border-radius: 18px;
    background-color: hsl(0deg 0% 0% / 20%);

    &:hover {
      background-color: hsl(0deg 0% 0% / 40%);
    }
  }
}
</style>
