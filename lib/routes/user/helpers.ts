import * as moment from "moment";
import * as ffmpegCommand from "fluent-ffmpeg";
import * as fs from "fs";
import { Storage } from "@google-cloud/storage";
const speech = require("@google-cloud/speech");
const { Translate } = require("@google-cloud/translate").v2;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpegCommand.setFfmpegPath(ffmpegPath);

export const getJwtPayload = (user) => {
  return {
    valid: true,
    firstName: user.name.first,
    lastName: user.name.last,
    id: user._id.toString(),
    stripeCustomerId: user.stripeCustomerId,
    cardToken: user.cardToken,
    expires: moment.utc().add(1, "day").format("YYYY-MM-DD HH:mm"),
  };
};

export const audioFromVideo = ({ keyUrl, fileName }) => {
  return new Promise((resolve, reject) => {
    const audioFileName = `${moment().format(
      "MM-DD-YYYY__HH-mm-ss"
    )}_${fileName}.mp3`;
    const outStream = fs.createWriteStream(audioFileName);
    ffmpegCommand(keyUrl)
      .toFormat("mp3")
      .on("end", (stdout, stderr) => {
        console.log("Completed");
        resolve(audioFileName);
      })
      .on("error", (err) => {
        reject(err.message);
        console.log("An error occured" + err.message);
      })
      .pipe(outStream, { end: true });
  });
};

export const getTransciptFromVideo = async (audioLink, fileName) => {
  const client = new speech.SpeechClient();
  const audio = {
    uri: audioLink,
  };
  const config = {
    enableWordTimeOffsets: true,
    encoding: "MP3",
    enableSpeakerDiarization: true,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const speechObj = {};
  let timeCount = 0;
  const [response] = await operation.promise();
  response.results.forEach((result) => {
    console.log(result);
    result.alternatives[0].words.forEach((wordInfo) => {
      // NOTE: If you have a time offset exceeding 2^32 seconds, use the
      // wordInfo.{x}Time.seconds.high to calculate seconds.
      const startSecs =
        `${wordInfo.startTime.seconds}` +
        "." +
        wordInfo.startTime.nanos / 100000000;
      const endSecs =
        `${wordInfo.endTime.seconds}` +
        "." +
        wordInfo.endTime.nanos / 100000000;
      if (parseInt(startSecs) < timeCount + 1) {
        if (!speechObj[`${timeCount} - ${timeCount + 1}`]) {
          speechObj[`${timeCount} - ${timeCount + 1}`] = wordInfo.word;
        } else {
          speechObj[`${timeCount} - ${timeCount + 1}`] = `${
            speechObj[`${timeCount} - ${timeCount + 1}`]
          } ${wordInfo.word}`;
        }
      } else {
        timeCount = Math.floor(parseInt(startSecs));
        if (!speechObj[`${timeCount} - ${timeCount + 1}`]) {
          speechObj[`${timeCount} - ${timeCount + 1}`] = wordInfo.word;
        } else {
          speechObj[`${timeCount} - ${timeCount + 1}`] = `${
            speechObj[`${timeCount} - ${timeCount + 1}`]
          } ${wordInfo.word}`;
        }
      }
    });
  });
  fs.unlink(fileName, () => {
    console.log("Audio File Removed");
  });
  return speechObj;
};

export const getTransciptFromVideoWithSubtitle = async (
  audioLink,
  fileName
) => {
  const client = new speech.SpeechClient();
  const audio = {
    uri: audioLink,
  };
  const config = {
    enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
    encoding: "MP3",
    enableSpeakerDiarization: true,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const srtData = createVTT(response.results);
  fs.unlink(fileName, () => {
    console.log("Audio File Removed");
  });
  console.log(srtData);
  return srtData;
};

export const uploadToGcpCloud = async (fileName): Promise<any> => {
  const storage = new Storage();
  return storage.bucket("realiize-audio").upload(fileName);
};

export const fetchSubtitleGcp = async (videoSubtitle, requestLang) => {
  const translate = new Translate();
  let [translations] = await translate.translate(videoSubtitle, requestLang);
  translations = Array.isArray(translations) ? translations : [translations];
  let newSubtitle = "";
  translations.forEach((translation, i) => {
    newSubtitle += `${translation}`;
  });
  return newSubtitle;
};

function createVTT(results) {
  let VTT = "";
  let counter = 0;
  let startTime = "00:00:00";
  let endTime = "00:00:00";
  let phrase = "";
  let phraseLength = 10;
  let index = 1;

  //for each tracnscript
  for (var i = 0; i < results.length; i++) {
    //loop through each word in each transcript
    for (var j = 0; j < results[i].alternatives[0].words.length; j++) {
      let start = JSON.stringify(
        results[i].alternatives[0].words[j].startTime.seconds.low
      );
      let end = JSON.stringify(
        results[i].alternatives[0].words[j].endTime.seconds.low
      );
      let word = JSON.stringify(results[i].alternatives[0].words[j].word);
      word = word.slice(1, word.length - 1);

      if (counter % phraseLength == 1) {
        //first entry in the phrase
        //console.log(start);

        startTime = secondsToFormat(start);
        //console.log((JSON.stringify(results[i].alternatives[0].words[j].startTime.seconds.low)));
        phrase = word;
        //console.log(counter + phrase);
      }
      if (counter % phraseLength > 1) {
        //addint a word
        phrase = phrase.concat(" " + word);
        //console.log(counter + phrase);
      }
      if (counter % phraseLength == 0) {
        //end of entry
        phrase = phrase.concat(" ", word);
        endTime = secondsToFormat(end);
        VTT += `
        ${index}
        ${startTime} --> ${endTime}
        ${phrase}
        `;
        index += 1;
      }
      counter++;
    }
  }
  return VTT;
}

function secondsToFormat(seconds) {
  let timeHours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  let timeMinutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  let timeSeconds = (seconds % 60).toString().padStart(2, "0");

  let formattedTime =
    timeHours + ":" + timeMinutes + ":" + timeSeconds + ".000";
  return formattedTime;
}
