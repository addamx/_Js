(() => {
  const mediaSource = new MediaSource();
  mediaSource.addEventListener('sourceopen', sourceOpen);

  async function sourceOpen(...args) {
    console.log('sourceopen', ...args);
    const mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    // 新建一个 sourceBuffer
    const sourceBuffer = mediaSource.addSourceBuffer(mime);

    // 加载一段 chunk，然后 append 到 sourceBuffer 中
    /** @type {ArrayBuffer} */
    const buffer = await fetchBuffer('./resource/frag_bunny.mp4');
    sourceBuffer.appendBuffer(buffer)

    sourceBuffer.addEventListener("updateend", async () => {
      // 这个时候才能加入新 chunk
      // 先设定新chunk加入的位置，比如第26秒处
      sourceBuffer.timestampOffset = 60
      // 然后加入
      /** @type {ArrayBuffer} */
      const buffer = await fetchBuffer('./resource/frag_bunny1.mp4');
      sourceBuffer.appendBuffer(buffer)
    });
  }

  // 以二进制格式请求某个url
  function fetchBuffer(url,) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest;
      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.send();
    })
  }

  const video = document.querySelector('video')
  video.src = URL.createObjectURL(mediaSource);
})();
