import Peer from "peerjs";
import { useRef } from "react";
import { useEffect } from "react";

const VideoCall = () => {
  const anotherVideoRef = useRef(null);
  const myVideoRef = useRef();
  const myPeer = useRef();

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", function (id) {
    });

    peer.on("call", (call) => {
      let getUserMedia =
        navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.play();
          // send myMediaStream to the caller
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            anotherVideoRef.current.srcObject = remoteStream;
            anotherVideoRef.current.play();
          });
        },
      );
    });
    myPeer.current = peer;
  }, []);

  return (
    <>
      <div>
        <video ref={myVideoRef} />
      </div>

      <div>
        <video ref={anotherVideoRef} />
      </div>
    </>
  );
};

export default VideoCall;
