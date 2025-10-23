import React, { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import axios from "axios";

const VideoCall = ({ roomName, doctorName ,appointmentId}) => {
  const [api, setApi] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Function to toggle recording
  const toggleRecording = async () => {
    if (!api) return;

    if (!isRecording) {
      // Start recording
      api.executeCommand('startRecording', {
        mode: 'file', // 'file' for recording to a file, 'stream' for live streaming
      });
      setIsRecording(true);
    } else {
      // Stop recording
      api.executeCommand('stopRecording', 'file');
      setIsRecording(false);
    }
  };

  const handleApiReady = (externalApi) => {
    setApi(externalApi);

    externalApi.executeCommand("mute", ["audio"]);

    externalApi.addEventListener("participantJoined", onParticipantJoined);
  };

  const onParticipantJoined = (participant) => {
    console.log("Participant joined:", participant);
  };

  useEffect(() => {
    return () => {
      if (api) {
        api.removeEventListener("participantJoined", onParticipantJoined);
      }
    };
  }, [api]);

  const handleMeetingStart = async() => {
    console.log("Started video call");
    try{
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/patient/appointment-join/${appointmentId}`)
      console.log(res)
    }
    catch(error)
    {
      console.log(error)
    }
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <JitsiMeeting
        roomName={roomName}
        // roomName="room1"
        domain="meet.jit.si"
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
        }}
        configOverwrite={{
          startWithAudioMuted: true,
          enableWelcomePage: false,
        }}
        userInfo={{
          displayName: doctorName,
        }}
        onApiReady={(externalApi) => {
          // Log when the video call starts
          handleMeetingStart();

        }}
        // onApiReady={handleApiReady}
      />
      
      {/* <div style={{ marginTop: "10px" }}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div> */}
    </div>
  );
};

export default VideoCall;


// import React, { useEffect, useRef, useState } from "react";

// const VideoCall = () => {
//   const [api, setApi] = useState(null);
//   const meetContainerRef = useRef(null);

//   useEffect(() => {
//     const initIframeAPI = () => {
//       const domain = '8x8.vc';
//       const options = {
//         roomName: 'vpaas-magic-cookie-79604eed62274ea09ab5953f96121b77/room1',
//         jwt: 'eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNzk2MDRlZWQ2MjI3NGVhMDlhYjU5NTNmOTYxMjFiNzcvZWRhZDhjLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MzAxMDU4NjksImV4cCI6MTczMDExMzA2OSwibmJmIjoxNzMwMTA1ODY0LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNzk2MDRlZWQ2MjI3NGVhMDlhYjU5NTNmOTYxMjFiNzciLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6IndlYnN1cHBvcnQiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTEwMjgxMzU4ODI5NTY1ODA0NjY5IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJ3ZWJzdXBwb3J0QGJhcm9kYXdlYi5uZXQifX0sInJvb20iOiIqIn0.pBbUb7kjucjUe49m7thm1YFfMPSBqWtWPgj-SlExJKSvUeiG-Iisb8b4VrgdoqjVUskVb5wYICaiSJk_flhH6wLBcSVAx6RADCqn_3S3yVkjI6e1umxkuzRqvSC3XF2r_Kkj2z672bl_B0TCfLJgu9zQDOKu_eGLsjVzQMtgf4WWLpYq1XwwFGN-j1KUKB5bYfTOiyE-piktlul0QTd2ktw4oxOZD0W5Qxr0XHVR5TbX4wStkk6Smqo1Z-05daEHfSpyS0ModOSGhYzuFu51IqOneBONUDnFbZdkfI_YbMt3q7NtTiGcKvfBK7IwsJmZfC1s70_ejwBNLacYq5im0Q',
//         width: 700,
//         height: 700,
//         parentNode: meetContainerRef.current,
//       };

//        try {
//       const newApi = new window.JitsiMeetExternalAPI(domain, options);
//       setApi(newApi);
//     } catch (error) {
//       console.error("Error initializing Jitsi API", error);
//     }

//       // return () => {
//       //   if (newApi) newApi.dispose();
//       // };
//     };

//     if (window.JitsiMeetExternalAPI) {
//       initIframeAPI();
//     } else {
//       const script = document.createElement("script");
//       script.src = "https://8x8.vc/vpaas-magic-cookie-96f0941768964ab380ed0fbada7a502f/external_api.js";
//       script.async = true;
//       script.onload = () => initIframeAPI();
//       document.body.appendChild(script);
//     }
//   }, []);

//   return <div ref={meetContainerRef} style={{ height: "700px", width: "100%" }} />;
// };

// export default VideoCall;
