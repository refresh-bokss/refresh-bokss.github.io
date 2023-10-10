function globalgetstart() {
  document.getElementById("introductiondiv").style.display = "none";
  document.getElementById("recorddiv").style.display = "";
  document.getElementById('block-bokss-page-title').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  new Splide( '.splide', {
    type: 'loop',
    perPage: 1, 
  } ).mount();
}

function globalstartrecording() {
  document.getElementById("recorddiv").style.display = "none";
  document.getElementById("timer").style.display = "";
  document.getElementById("stopdiv").style.display = "";
  document.getElementById('block-bokss-page-title').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
  window.markDate = new Date();
  document.addEventListener("DOMContentLoaded", function () {
    var absentDivs = document.querySelectorAll("div.absent");
    absentDivs.forEach(function (div) {
      div.classList.toggle("present");
    });
  });
  updateClock();
}

function updateClock() {
  var currDate = new Date();
  var diff = currDate - window.markDate;
  document.getElementById("timer").innerHTML = format(diff / 1000);
  setTimeout(updateClock, 1000);
}

function format(seconds) {
  var numhours = parseInt(
    Math.floor(((seconds % 31536000) % 86400) / 3600),
    10
  );
  var numminutes = parseInt(
    Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
    10
  );
  var numseconds = parseInt((((seconds % 31536000) % 86400) % 3600) % 60, 10);
  return (
    (numhours < 10 ? "0" + numhours : numhours) +
    ":" +
    (numminutes < 10 ? "0" + numminutes : numminutes) +
    ":" +
    (numseconds < 10 ? "0" + numseconds : numseconds)
  );
}
function globalstoprecording() {
  document.getElementById("stopdiv").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("audiodiv").style.display = "";
  document.getElementById('block-bokss-page-title').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
}

function globalsubmit() {
  document.getElementById("audiodiv").style.display = "none";
  document.getElementById("completediv").style.display = "";
  document.getElementById('block-bokss-page-title').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
  setTimeout("window.location.href = '/record.html'", 5000);
}

function globalrestart() {
  document.getElementById("audiodiv").style.display = "none";
  document.getElementById("recorddiv").style.display = "";
  document.getElementById('block-bokss-page-title').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
}

var record = document.getElementById("record");
var stop = document.getElementById("stop");
//var play = document.getElementById("play");
var audio = document.getElementById("audio");
//var downWav = document.getElementById("downWav");
//var downPcm = document.getElementById("downPcm");
var recorder = null;

// 录制
record.addEventListener("click", function () {
  if (recorder !== null) recorder.close();
  Recorder.init(function (rec) {
    recorder = rec;
    recorder.start();
  });
});

// 停止
stop.addEventListener("click", function () {
  if (recorder === null) return alert("請先錄音");
  recorder.stop();
  recorder.play(audio);
  document.getElementById("selectSplide").value = document.getElementsByClassName("is-visible")[0].innerHTML.substring(23, 25);
  document.getElementById("currentDate").value = moment().format('YYYY-MM-DD');
});

var form = document.getElementById("dataurl-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("audiodiv").style.display = "none";
  document.getElementById("completediv").style.display = "";
  setTimeout("window.location.href = '/record.html'", 5000);
  var data = new FormData(form);
  var action = e.target.action;
  fetch(action, {
    method: "POST",
    body: data,
  }).then(function () {
    //alert("Success!");
  });
});

// 播放
//play.addEventListener("click", function() {
//  if (recorder === null) return alert("请先录音");
//  recorder.play(audio);
//});

// 下载 wav
//downWav.addEventListener("click", function() {
//  if (recorder === null) return alert("请先录音");
//  var src = recorder.wavSrc();
//  downWav.setAttribute("href", src);
//});

// 下载 pcm
//downPcm.addEventListener("click", function() {
//  if (recorder === null) return alert("请先录音");
//  var src = recorder.pcmSrc();
//  downPcm.setAttribute("href", src);
//});

(function (window) {
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  window.audioBufferSouceNode = null;
  var Recorder = function (stream, config) {
    //var context = new (window.AudioContext || window.webkitAudioContext)();
    config = config || {};
    config.channelCount = 1;
    config.numberOfInputChannels = config.channelCount;
    config.numberOfOutputChannels = config.channelCount;
    config.sampleBits = config.sampleBits || 16;
    config.sampleRate = config.sampleRate || 8000;
    config.bufferSize = 4096; //创建缓存，用来缓存声音

    var audioInput, volume, recorder, audioData;

    function initializeAudio() {
      context = new (window.AudioContext || window.webkitAudioContext)();
      audioInput = context.createMediaStreamSource(stream);
      volume = context.createGain();
      audioInput.connect(volume);
      recorder = context.createScriptProcessor(
        config.bufferSize,
        config.channelCount,
        config.channelCount
      );
      audioData = {
        size: 0, //录音文件长度
        buffer: [], //录音缓存
        inputSampleRate: context.sampleRate, //输入采样率
        inputSampleBits: 16, //输入采样数位 8, 16
        outputSampleRate: config.sampleRate, //输出采样率
        oututSampleBits: config.sampleBits, //输出采样数位 8, 16
        input: function (data) {
          // 实时存储录音的数据
          this.buffer.push(new Float32Array(data)); //Float32Array
          this.size += data.length;
        },
        getRawData: function () {
          //合并压缩
          //合并
          var data = new Float32Array(this.size);
          var offset = 0;
          for (var i = 0; i < this.buffer.length; i++) {
            data.set(this.buffer[i], offset);
            offset += this.buffer[i].length;
          }
          // 压缩
          var getRawDataion = parseInt(
            this.inputSampleRate / this.outputSampleRate
          );
          var length = data.length / getRawDataion;
          var result = new Float32Array(length);
          var index = 0,
            j = 0;
          while (index < length) {
            result[index] = data[j];
            j += getRawDataion;
            index++;
          }
          return result;
        },
        covertWav: function () {
          // 转换成wav文件数据
          var sampleRate = Math.min(
            this.inputSampleRate,
            this.outputSampleRate
          );
          var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
          var bytes = this.getRawData();
          var dataLength = bytes.length * (sampleBits / 8);
          var buffer = new ArrayBuffer(44 + dataLength);
          var data = new DataView(buffer);
          var offset = 0;
          var writeString = function (str) {
            for (var i = 0; i < str.length; i++) {
              data.setUint8(offset + i, str.charCodeAt(i));
            }
          };
          // 资源交换文件标识符
          writeString("RIFF");
          offset += 4;
          // 下个地址开始到文件尾总字节数,即文件大小-8
          data.setUint32(offset, 36 + dataLength, true);
          offset += 4;
          // WAV文件标志
          writeString("WAVE");
          offset += 4;
          // 波形格式标志
          writeString("fmt ");
          offset += 4;
          // 过滤字节,一般为 0x10 = 16
          data.setUint32(offset, 16, true);
          offset += 4;
          // 格式类别 (PCM形式采样数据)
          data.setUint16(offset, 1, true);
          offset += 2;
          // 通道数
          data.setUint16(offset, config.channelCount, true);
          offset += 2;
          // 采样率,每秒样本数,表示每个通道的播放速度
          data.setUint32(offset, sampleRate, true);
          offset += 4;
          // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
          data.setUint32(
            offset,
            config.channelCount * sampleRate * (sampleBits / 8),
            true
          );
          offset += 4;
          // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
          data.setUint16(offset, config.channelCount * (sampleBits / 8), true);
          offset += 2;
          // 每样本数据位数
          data.setUint16(offset, sampleBits, true);
          offset += 2;
          // 数据标识符
          writeString("data");
          offset += 4;
          // 采样数据总数,即数据总大小-44
          data.setUint32(offset, dataLength, true);
          offset += 4;
          // 写入采样数据
          data = this.reshapeWavData(sampleBits, offset, bytes, data);
          return data;
        },
        getFullWavData: function () {
          // 用blob生成文件
          var data = this.covertWav();
          return new Blob([data], { type: "audio/wav" });
        },
        closeContext: function () {
          //关闭AudioContext否则录音多次会报错
          context.close();
        },
        reshapeWavData: function (sampleBits, offset, iBytes, oData) {
          // 8位采样数位
          if (sampleBits === 8) {
            for (var i = 0; i < iBytes.length; i++, offset++) {
              var s = Math.max(-1, Math.min(1, iBytes[i]));
              var val = s < 0 ? s * 0x8000 : s * 0x7fff;
              val = parseInt(255 / (65535 / (val + 32768)));
              oData.setInt8(offset, val, true);
            }
          } else {
            for (var i = 0; i < iBytes.length; i++, offset += 2) {
              var s = Math.max(-1, Math.min(1, iBytes[i]));
              oData.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
            }
          }
          return oData;
        },
      };
      recorder.onaudioprocess = function (e) {
        audioData.input(e.inputBuffer.getChannelData(0));
      };
    }
    // 开始录音
    this.start = function () {
      if (context === undefined) {
        initializeAudio();
      }
      audioInput.connect(recorder);
      recorder.connect(context.destination);
      //audioInput.connect(recorder);
      //recorder.connect(context.destination);
    };
    // 获取音频文件
    this.getBlob = function () {
      this.stop();
      return audioData.getFullWavData();
    };

    // 播放
    this.play = function (audio) {
      //audio.src = this.getBlob().target.result;
      var fileReader = new FileReader();
      fileReader.onload = function (event) {
        var dataURL = event.target.result;
        // Use the dataURL as needed
        //console.log(dataURL);
        audio.src = dataURL;
        //replaceAudio(dataURL);
        document.getElementById("dataurl").value = audio.src;
      };
      fileReader.readAsDataURL(this.getBlob());
    };
    // 停止
    this.stop = function () {
      recorder.disconnect();
    };
    this.close = function () {
      audioData.closeContext();
    };
    initializeAudio();
  };
  // 获取麦克风

  Recorder.init = function (callback, config) {
    if (callback) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
            var rec = new Recorder(stream, config);
            callback(rec);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        alert("不支援錄音功能");
      }
    }
  };

  window.Recorder = Recorder;
})(window);
