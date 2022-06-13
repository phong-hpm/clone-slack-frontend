class MediaStreamMock {
  id: string = "mediaStream_id";
  active: boolean = true;
  onactive() {}
  onaddtrack() {}
  oninactive() {}
  onremovetrack() {}
  addTrack() {}
  clone() {
    return this;
  }
  getAudioTracks() {
    return [];
  }
  getTrackById() {
    return null;
  }
  getTracks() {
    return [];
  }
  getVideoTracks() {
    return [];
  }
  removeTrack() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

window.MediaStream = MediaStreamMock;

export {};
