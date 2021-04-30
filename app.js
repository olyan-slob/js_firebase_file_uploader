import firebase from "firebase/app";
import "firebase/storage";
import { upload } from "./upload.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkXXjPeSAPTsBs23659x1_7yq3b_4fQso",
  authDomain: "upload-files-180ca.firebaseapp.com",
  projectId: "upload-files-180ca",
  storageBucket: "upload-files-180ca.appspot.com",
  messagingSenderId: "20703941589",
  appId: "1:20703941589:web:db460482ff0fdadc80635c",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", ".gif"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0
            ) + "%";
          const block = blocks[index].querySelector(".preview-info-progress");
          block.textContent = percentage;
          block.style.width = percentage;
        },
        (error) => {
          console.log(error);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            console.log("Download URL", url);
          });
        }
      );
    });
  },
});
