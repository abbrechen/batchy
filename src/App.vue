<template>
  <div id="app">
    <h1>xxx</h1>
    <input type="text" v-model="name" id="name" />
    <button @click="handleDownload()">Download</button>
    <p>Choosable syntax</p>
    <ul class="chips">
      <li @click="addTextToInput('{{name}}')">name</li>
      <li @click="addTextToInput('{{date}}')">date</li>
      <li @click="addTextToInput('{{file}}')">file</li>
      <li @click="addTextToInput('{{scaling}}')">scaling</li>
    </ul>
    <select v-model="dateFormat" id="dateFormat">
      <option value="date-01">YYMMDD</option>
      <option value="date-02">YYYY-MM-DD</option>
      <option value="date-03">DD-MM-YYYY</option>
      <option value="date-04">MM-DD-YYYY</option>
    </select>
    <input type="checkbox" v-model="exportFrameSize" id="exportFrameSize" />
    <label for="exportFrameSize">export in frame size</label><br />
    <select v-model="fileFormat" id="fileFormat">
      <option value="file-01">PNG</option>
      <option value="file-02">JPG</option>
      <option value="file-03">SVG</option>
      <option value="file-04">PDF</option>
    </select>
    <select v-model="scaling" id="scaling">
      <option value="scaling-01">x1</option>
      <option value="scaling-02">x2</option>
      <option value="scaling-03">x3</option>
      <option value="scaling-04">x4</option>
    </select>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const name = ref('');
    const dateFormat = ref('date-01');
    const fileFormat = ref('file-01');
    const scaling = ref('scaling-01');
    const exportFrameSize = ref(false);

    const addTextToInput = (text) => {
      // name.value += text;
    };

    const handleDownload = () => {
      console.log('asd')
      // const pluginMessage = JSON.stringify({
      //   type: '01-collect-data',
      //   name: name.value,
      //   dateFormat: dateFormat.value,
      //   fileFormat: fileFormat.value,
      //   scaling: scaling.value,
      //   isExportFrameSizeChecked: exportFrameSize.value,
      // });
      // parent.postMessage({ pluginMessage }, '*');
    };

    const byteDataToBlob = (byteData) => {
      return new Blob([new Uint8Array(byteData)], { type: 'image/png' });
    };

    const downloadZip = async (files) => {
      // const zip = new JSZip();
      // files.forEach((file) => {
      //   zip.file(`${file.name}.png`, byteDataToBlob(file.binaryData[0]), { base64: true });
      // });
      // zip.generateAsync({ type: 'blob' }).then((content) => {
      //   const zipName = 'assets';
      //   const blobURL = window.URL.createObjectURL(content);
      //   const link = document.createElement('a');
      //   link.href = blobURL;
      //   link.download = `${zipName}.zip`;
      //   link.click();
      //   window.URL.revokeObjectURL(blobURL);
      //   link.remove();
      // });
    };

    const downloadSingleFile = (file) => {
      // let blob;
      // switch (file.format) {
      //   case 'PNG':
      //     blob = new Blob(file.binaryData, { type: 'image/png' });
      //     break;
      //   case 'JPG':
      //     blob = new Blob(file.binaryData, { type: 'image/jpg' });
      //     break;
      //   case 'SVG':
      //     blob = new Blob(file.binaryData, { type: 'image/svg+xml' });
      //     break;
      //   case 'PDF':
      //     blob = new Blob(file.binaryData, { type: 'application/pdf' });
      //     break;
      //   default:
      //     console.error('undefined or unknown file format');
      // }
      // const blobURL = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = blobURL;
      // link.download = `${file.name}.${file.format}`;
      // link.click();
      // window.URL.revokeObjectURL(blobURL);
      // link.remove();
    };

    window.onmessage = (msg) => {
      // const m = msg.data.pluginMessage;
      // if (m.type === '02-export-bundle') {
      //   const exportBundle = m.exportBundle;
      //   exportBundle.length > 1 ? downloadZip(exportBundle) : downloadSingleFile(exportBundle[0]);
      // }
    };

    return {
      name,
      dateFormat,
      fileFormat,
      scaling,
      exportFrameSize,
      addTextToInput,
      handleDownload,
    };
  },
};
</script>

<style lang="scss">
/*
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

.chips li {
  display: inline-block;
  width: 60px;
  height: 24px;
  text-align: center;
  border-radius: 18px;
  background-color: hsl(0deg 0% 0% / 20%);
}

.chips li:hover {
  background-color: hsl(0deg 0% 0% / 40%);
}
  */
</style>
