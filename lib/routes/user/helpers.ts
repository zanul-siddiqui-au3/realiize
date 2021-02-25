import * as moment from "moment";
import * as ffmpegCommand from "fluent-ffmpeg";
import * as fs from "fs";
import { Storage } from "@google-cloud/storage";
import { rejects } from "assert";
const speech = require("@google-cloud/speech");
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

export const uploadToGcpCloud = async (fileName): Promise<any> => {
  const storage = new Storage();
  return storage.bucket("realiize-audio").upload(fileName);
};
