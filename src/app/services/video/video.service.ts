import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { DomSanitizer } from "@angular/platform-browser";
import { map } from "rxjs/operators";
import { VideoData } from "src/app/models/video-data";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root"
})
export class VideoService {
  constructor(
    private afs: AngularFirestore,
    private domSanitizer: DomSanitizer
  ) {}

  getVideos() {
    return this.afs
      .collection("videoUrl")
      .snapshotChanges()
      .pipe(
        map(data =>
          data.map(e => {
            const vl: VideoData = {
              id: e.payload.doc.id,
              isEdit: false,
              vidName: e.payload.doc.data()["vidName"],
              videoUrl: e.payload.doc.data()["videoUrl"]
            };
            return vl;
          })
        )
      );
  }

  deleteVideo(record_id: string) {
    // from firestore DB
    this.afs.doc("videoUrl/" + record_id).delete();

    //from firebase storage
    var storage = firebase.storage();
    var storageRef = storage.ref(record_id);
    storageRef
      .delete()
      .then(function() {})
      .catch(function(error) {});
  }
}
